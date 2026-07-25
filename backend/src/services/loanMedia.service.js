const prisma = require("../config/prisma");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

const auditService = require("./audit.service");

class LoanMediaService {
  async uploadMedia(userId, loanId, files, body, context = {}) {
    const loan = await prisma.loanRequest.findFirst({
      where: {
        id: loanId,
        borrowerId: userId,
      },
    });

    if (!loan) {
      throw new NotFoundError("Loan request not found.");
    }

    if (!files || files.length === 0) {
      throw new BadRequestError("Please upload at least one file.");
    }

    const media = await prisma.$transaction(
      files.map((file, index) =>
        prisma.loanMedia.create({
          data: {
            loanId,
            mediaType: body.mediaType,
            documentType:
              body.mediaType === "DOCUMENT"
                ? body.documentType
                : null,
            fileName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            isCover: index === 0 && body.mediaType === "IMAGE",
            displayOrder: index,
          },
        })
      )
    );

    await auditService.log({
      userId,
      action: "LOAN_MEDIA_UPLOADED",
      description: `${media.length} media file(s) uploaded.`,
      ...context,
    });

    return media;
  }

  async getLoanMedia(loanId) {
    return prisma.loanMedia.findMany({
      where: {
        loanId,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });
  }

  async deleteMedia(userId, mediaId, context = {}) {
    const media = await prisma.loanMedia.findFirst({
      where: {
        id: mediaId,
        loan: {
          borrowerId: userId,
        },
      },
    });

    if (!media) {
      throw new NotFoundError("Media not found.");
    }

    await prisma.loanMedia.delete({
      where: {
        id: mediaId,
      },
    });

    await auditService.log({
      userId,
      action: "LOAN_MEDIA_DELETED",
      description: `${media.fileName} deleted.`,
      ...context,
    });

    return true;
  }

  async setCoverImage(userId, mediaId, context = {}) {
    const media = await prisma.loanMedia.findFirst({
      where: {
        id: mediaId,
        mediaType: "IMAGE",
        loan: {
          borrowerId: userId,
        },
      },
    });

    if (!media) {
      throw new NotFoundError("Image not found.");
    }

    await prisma.loanMedia.updateMany({
      where: {
        loanId: media.loanId,
        mediaType: "IMAGE",
      },
      data: {
        isCover: false,
      },
    });

    const cover = await prisma.loanMedia.update({
      where: {
        id: mediaId,
      },
      data: {
        isCover: true,
      },
    });

    await auditService.log({
      userId,
      action: "LOAN_COVER_UPDATED",
      description: "Loan cover image updated.",
      ...context,
    });

    return cover;
  }
}

module.exports = new LoanMediaService();