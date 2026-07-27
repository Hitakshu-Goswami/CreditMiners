const prisma =
    require("../config/prisma");


class GrowthProjectionRepository {


    async create(
        data
    ){

        return prisma.growthProjection.create({

            data

        });

    }



    async findByUser(
        userId
    ){

        return prisma.growthProjection.findMany({

            where:{
                userId
            },

            orderBy:{
                createdAt:"desc"
            }

        });

    }



    async findById(
        id
    ){

        return prisma.growthProjection.findUnique({

            where:{
                id
            },

            include:{

                scenarios:true,

                snapshots:true,

                goals:true

            }

        });

    }


    /**
 * -------------------------------------------------------
 * Create Complete Projection
 * -------------------------------------------------------
 */

async createCompleteProjection(
    data
) {

    return prisma.growthProjection.create({

        data: {

            userId:
                data.userId,


            scenarioType:
                data.scenarioType,


            projectionYears:
                data.projectionYears,


            wealthScore:
                data.wealthScore,


            projectedNetWorth:
                data.projectedNetWorth,


            financialFreedomProgress:
                data.financialFreedomProgress,


            status:
                data.status,


            scenarios: {

                createMany: {

                    data:
                        data.scenarios

                }

            },


            snapshots: {

                createMany: {

                    data:
                        data.snapshots

                }

            },


            goals: {

                createMany: {

                    data:
                        data.goals

                }

            }

        },

        include: {

            scenarios:true,

            snapshots:true,

            goals:true

        }

    });

}
/**
 * -------------------------------------------------------
 * Get Projection History
 * -------------------------------------------------------
 */

async getHistory(
    userId
) {

    return prisma.growthProjection.findMany({

        where: {

            userId

        },

        orderBy: {

            createdAt: "desc"

        },

        select: {

            id: true,

            scenarioType: true,

            projectionYears: true,

            wealthScore: true,

            projectedNetWorth: true,

            financialFreedomProgress: true,

            status: true,

            createdAt: true

        }

    });

}
}


module.exports =
    new GrowthProjectionRepository();