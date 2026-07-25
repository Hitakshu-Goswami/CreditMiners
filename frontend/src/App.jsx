import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const defaultAnswers = {
  monthlyAmount: 2000,
  horizonYears: 3,
  lossComfort: "medium",
  emergencyFundMonths: 2,
  incomeStability: "mostly_stable",
  experience: "some",
};

const riskLabel = {
  LOW: "Low risk",
  MEDIUM: "Medium risk",
  HIGH: "High risk",
};

const pages = [
  { id: "overview", label: "Overview" },
  { id: "profiles", label: "Profiles" },
  { id: "risk", label: "Risk profile" },
  { id: "advisor", label: "Advisor" },
];

const categoryLabels = {
  utilityRegularity: "Utility discipline",
  rechargeConsistency: "Recharge rhythm",
  ecommerceDiscipline: "Spend behavior",
  cashflowStrength: "Cash buffer",
  dataCompleteness: "Data depth",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const fetchJson = async (path, options) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const body = await response.json();
  return body.data;
};

function RiskPill({ risk }) {
  return <span className={`riskPill ${risk.toLowerCase()}`}>{riskLabel[risk]}</span>;
}

function ScoreLine({ score }) {
  const percent = Math.max(0, Math.min(100, ((score - 300) / 600) * 100));

  return (
    <div className="scoreLine" aria-label={`Score ${score}`}>
      <div className="scoreLineTrack">
        <div className="scoreLineFill" />
        <i style={{ left: `${percent}%` }} />
      </div>
      <div className="scoreTicks">
        <span>300</span>
        <span>620</span>
        <span>740</span>
        <span>900</span>
      </div>
    </div>
  );
}

function FeatureMeter({ label, value }) {
  const percent = Math.round((value || 0) * 100);

  return (
    <div className="featureMeter">
      <div>
        <span>{label}</span>
        <strong>{percent}%</strong>
      </div>
      <progress max="100" value={percent} />
    </div>
  );
}

function ProjectionChart({ projections }) {
  const rows = projections || [];
  const maxValue = Math.max(...rows.flatMap((row) => [row.conservative, row.base, row.optimistic]), 1);
  const colors = {
    conservative: "#2da164",
    base: "#110905",
    optimistic: "#f08a36",
  };

  return (
    <div className="projectionBars">
      {rows.map((row) => (
        <div className="projectionGroup" key={row.years}>
          {["conservative", "base", "optimistic"].map((scenario) => (
            <div className="projectionBarWrap" key={scenario}>
              <span>{formatCurrency(row[scenario]).replace(".00", "")}</span>
              <div
                className="projectionBar"
                style={{
                  height: `${Math.max(16, (row[scenario] / maxValue) * 220)}px`,
                  background: colors[scenario],
                }}
              />
            </div>
          ))}
          <strong>{row.years}Y</strong>
        </div>
      ))}
    </div>
  );
}

function Header({ activePage, setActivePage }) {
  return (
    <header className="appHeader">
      <button className="brandButton" type="button" onClick={() => setActivePage("overview")}>
        <span>C</span>
        CreditMiners
      </button>
      <nav aria-label="Primary navigation">
        {pages.map((page) => (
          <button
            className={activePage === page.id ? "active" : ""}
            key={page.id}
            type="button"
            onClick={() => setActivePage(page.id)}
          >
            {page.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function Overview({ summary, profiles, setActivePage, setSelectedUserId }) {
  const topProfiles = [...profiles].sort((a, b) => b.score - a.score).slice(0, 4);
  const needsAttention = profiles.filter((profile) => profile.riskLevel !== "LOW").slice(0, 4);
  const total = summary?.totalProfiles || 1;
  const lowPercent = Math.round(((summary?.buckets.LOW || 0) / total) * 100);
  const mediumPercent = Math.round(((summary?.buckets.MEDIUM || 0) / total) * 100);
  const highPercent = Math.round(((summary?.buckets.HIGH || 0) / total) * 100);

  const openProfile = (id) => {
    setSelectedUserId(id);
    setActivePage("profiles");
  };

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">FinTech · Explainable AI · Consent-style signals</p>
          <h1>Turn everyday digital behavior into a transparent credit story.</h1>
          <p>
            CreditMiners converts recharges, utility payments, e-commerce patterns, and cashflow snapshots into a
            credit-likelihood score with clear reasons and practical next steps.
          </p>
          <div className="heroActions">
            <button className="primaryButton" type="button" onClick={() => setActivePage("profiles")}>
              Explore profiles
            </button>
            <button className="secondaryButton" type="button" onClick={() => setActivePage("risk")}>
              Start risk profile
            </button>
          </div>
        </div>
        <aside className="heroCard">
          <span>Average score</span>
          <strong>{summary?.averageScore}</strong>
          <p>{summary?.source}</p>
        </aside>
      </section>

      <section className="metricStrip">
        <article>
          <span>{summary?.totalProfiles}</span>
          <small>synthetic users</small>
        </article>
        <article>
          <span>{summary?.buckets.LOW}</span>
          <small>low risk</small>
        </article>
        <article>
          <span>{summary?.buckets.MEDIUM}</span>
          <small>medium risk</small>
        </article>
        <article>
          <span>{summary?.buckets.HIGH}</span>
          <small>high risk</small>
        </article>
      </section>

      <section className="overviewGrid">
        <article className="thesisPanel">
          <p className="eyebrow">The thesis</p>
          <h2>Score repayment intent from signals users already create.</h2>
          <p>
            A prescreening layer can be useful before formal underwriting: it is consent-first, explainable per
            decision, and oriented toward improvement rather than rejection.
          </p>
          <div className="proofGrid">
            <span>
              <b>3</b>
              source families
            </span>
            <span>
              <b>5</b>
              feature groups
            </span>
            <span>
              <b>Top 3</b>
              explanations
            </span>
          </div>
        </article>

        <article className="riskMixPanel">
          <div className="sectionTitle">
            <h2>Risk mix</h2>
            <button type="button" onClick={() => setActivePage("profiles")}>
              View all
            </button>
          </div>
          <div className="riskMixBar">
            <span className="lowPart" style={{ width: `${lowPercent}%` }} />
            <span className="mediumPart" style={{ width: `${mediumPercent}%` }} />
            <span className="highPart" style={{ width: `${highPercent}%` }} />
          </div>
          <dl className="riskLegend">
            <div>
              <dt>Low</dt>
              <dd>{lowPercent}%</dd>
            </div>
            <div>
              <dt>Medium</dt>
              <dd>{mediumPercent}%</dd>
            </div>
            <div>
              <dt>High</dt>
              <dd>{highPercent}%</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="listGrid">
        <ProfileList title="Top likelihood" subtitle="Highest CreditMiners scores" profiles={topProfiles} onOpen={openProfile} />
        <ProfileList title="Needs attention" subtitle="Medium and high risk bands" profiles={needsAttention} onOpen={openProfile} />
      </section>
    </>
  );
}

function ProfileList({ title, subtitle, profiles, onOpen }) {
  return (
    <article className="rankedList">
      <div className="sectionTitle">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      {profiles.map((profile) => (
        <button className="rankedRow" key={profile.id} type="button" onClick={() => onOpen(profile.id)}>
          <span>
            <strong>{profile.fullName}</strong>
            <small>
              {profile.city} · {profile.occupation}
            </small>
          </span>
          <em>{profile.score}</em>
          <RiskPill risk={profile.riskLevel} />
        </button>
      ))}
    </article>
  );
}

function Profiles({ profiles, assessment, selectedUserId, setSelectedUserId }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filteredProfiles = profiles.filter((profile) => {
    const matchesFilter = filter === "ALL" || profile.riskLevel === filter;
    const haystack = `${profile.fullName} ${profile.city} ${profile.occupation}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  });

  return (
    <>
      <section className="pageIntro">
        <p className="eyebrow">Portfolio</p>
        <h1>Sample profiles</h1>
        <p>Every card is backed by the same transparent scorecard, top features, and improvement pathway.</p>
      </section>

      <section className="profileWorkspace">
        <div className="profileToolbar">
          <div className="segmented">
            {["ALL", "LOW", "MEDIUM", "HIGH"].map((risk) => (
              <button className={filter === risk ? "active" : ""} key={risk} type="button" onClick={() => setFilter(risk)}>
                {risk === "ALL" ? "All" : riskLabel[risk].replace(" risk", "")}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, city, or role"
            type="search"
          />
        </div>

        <div className="profileGrid">
          {filteredProfiles.map((profile) => (
            <button
              className={`profileCard ${selectedUserId === profile.id ? "selected" : ""}`}
              key={profile.id}
              type="button"
              onClick={() => setSelectedUserId(profile.id)}
            >
              <div>
                <h2>{profile.fullName}</h2>
                <RiskPill risk={profile.riskLevel} />
              </div>
              <p>
                {profile.city} · {profile.cityTier} · {profile.occupation}
              </p>
              <div className="profileCardMeta">
                <span>
                  <small>Score</small>
                  <strong>{profile.score}</strong>
                </span>
                <span>
                  <small>Income</small>
                  <strong>{formatCurrency(profile.monthlyIncome)}/mo</strong>
                </span>
              </div>
              <ScoreLine score={profile.score} />
            </button>
          ))}
        </div>
      </section>

      {assessment && <AssessmentDetail assessment={assessment} />}
    </>
  );
}

function AssessmentDetail({ assessment }) {
  return (
    <section className="assessmentDetail">
      <div className="detailHeader">
        <div>
          <p className="eyebrow">Explainable decision</p>
          <h2>{assessment.user.fullName}</h2>
          <p>{assessment.summary}</p>
        </div>
        <div className={`largeScore ${assessment.riskLevel.toLowerCase()}`}>
          <span>{assessment.score}</span>
          <RiskPill risk={assessment.riskLevel} />
        </div>
      </div>

      <div className="detailGrid">
        <article className="explanationPanel">
          <h3>Top 3 score drivers</h3>
          {assessment.topFactors.map((factor) => (
            <div className="explanationRow" key={factor.key}>
              <b>{factor.rank}</b>
              <span>
                <strong>{factor.label}</strong>
                <small>{factor.description}</small>
              </span>
              <em className={factor.isPositive ? "positiveText" : "negativeText"}>{factor.displayValue}</em>
            </div>
          ))}
        </article>

        <article className="featurePanel">
          <h3>Feature groups</h3>
          {Object.entries(assessment.categoryScores).map(([key, value]) => (
            <FeatureMeter key={key} label={categoryLabels[key]} value={value} />
          ))}
        </article>
      </div>

      <article className="actionsPanel">
        <div className="sectionTitle">
          <div>
            <h3>Improvement pathway</h3>
            <p>Plain-language actions tied to weak signals.</p>
          </div>
        </div>
        <div className="actionGrid">
          {assessment.recommendations.map((item) => (
            <div className="actionCard" key={item.title}>
              <span>{item.priority}</span>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <small>{item.estimatedImpact}</small>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function RiskWizard({ questions, answers, setAnswers, investment, setActivePage }) {
  const [step, setStep] = useState(0);
  const question = questions[step];
  const isComplete = step >= questions.length;
  const progress = questions.length ? Math.round((Math.min(step + 1, questions.length) / questions.length) * 100) : 0;

  if (!questions.length) {
    return null;
  }

  const chooseAnswer = (value) => {
    setAnswers((current) => ({ ...current, [question.id]: value }));
  };

  return (
    <>
      <section className="pageIntro">
        <p className="eyebrow">Conversational profiling · 6 questions</p>
        <h1>Risk profile</h1>
        <p>Answer short prompts and the advisor converts them into a suitable micro-investment appetite.</p>
      </section>

      <section className="wizardShell">
        <div className="progressHeader">
          <span>{isComplete ? "Complete" : `Question ${step + 1} of ${questions.length}`}</span>
          <strong>{isComplete ? 100 : progress}%</strong>
        </div>
        <div className="progressTrack">
          <i style={{ width: `${isComplete ? 100 : progress}%` }} />
        </div>

        {!isComplete ? (
          <article className="questionCard">
            <p>Q {step + 1}</p>
            <h2>{question.prompt}</h2>
            <div className="answerStack">
              {question.options.map((option) => (
                <button
                  className={String(answers[question.id]) === String(option.value) ? "selected" : ""}
                  key={String(option.value)}
                  type="button"
                  onClick={() => chooseAnswer(option.value)}
                >
                  {option.label}
                  {String(answers[question.id]) === String(option.value) && <span>Selected</span>}
                </button>
              ))}
            </div>
            <div className="wizardActions">
              <button className="ghostButton" disabled={step === 0} type="button" onClick={() => setStep((current) => current - 1)}>
                Back
              </button>
              <button className="primaryButton" type="button" onClick={() => setStep((current) => current + 1)}>
                {step === questions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </article>
        ) : (
          <article className="resultCard">
            <p className="eyebrow">Your appetite</p>
            <h2>{riskLabel[investment.riskLevel].replace(" risk", "")}</h2>
            <p>{investment.plainLanguage}</p>
            <div className="riskTabs">
              <span className={investment.riskLevel === "LOW" ? "active" : ""}>Conservative</span>
              <span className={investment.riskLevel === "MEDIUM" ? "active" : ""}>Balanced</span>
              <span className={investment.riskLevel === "HIGH" ? "active" : ""}>Growth</span>
            </div>
            <div className="wizardActions center">
              <button className="primaryButton" type="button" onClick={() => setActivePage("advisor")}>
                Continue to advisor
              </button>
              <button className="secondaryButton" type="button" onClick={() => setStep(0)}>
                Retake
              </button>
            </div>
          </article>
        )}
      </section>
    </>
  );
}

function Advisor({ investment }) {
  if (!investment) return null;

  return (
    <>
      <section className="advisorHero">
        <div>
          <p className="eyebrow">Micro-investment advisor</p>
          <h1>{riskLabel[investment.riskLevel]} appetite</h1>
          <p>{investment.plainLanguage}</p>
        </div>
        <aside>
          <span>Monthly SIP</span>
          <strong>{formatCurrency(investment.monthlyAmount)}</strong>
        </aside>
      </section>

      <section className="advisorPanel">
        <div className="sectionTitle">
          <h2>Recommended allocation</h2>
          <span>{investment.riskLevel === "LOW" ? "Stable core" : investment.riskLevel === "HIGH" ? "Growth mix" : "Balanced blend"}</span>
        </div>
        <div className="allocationStrip">
          {investment.allocation.map((item, index) => (
            <span className={`stripPart part${index}`} key={item.category} style={{ width: `${item.percentage}%` }} />
          ))}
        </div>
        <div className="allocationCards">
          {investment.allocation.map((item, index) => (
            <article key={item.category}>
              <small>Band {index + 1}</small>
              <strong>{item.percentage}%</strong>
              <p>{item.category}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="advisorGrid">
        <article className="chartPanel">
          <div className="sectionTitle">
            <div>
              <h2>Growth projection</h2>
              <p>Illustrative outcomes on a {formatCurrency(investment.monthlyAmount)} monthly SIP.</p>
            </div>
            <div className="chartLegend">
              <span className="conservative">Conservative</span>
              <span className="base">Base</span>
              <span className="optimistic">Optimistic</span>
            </div>
          </div>
          <ProjectionChart projections={investment.projections} />
        </article>

        <article className="whyPanel">
          <p className="eyebrow">Why this mix</p>
          <ul>
            <li>Allocation is constrained to simple, familiar instrument categories.</li>
            <li>Debt and liquid exposure reduce monthly anxiety for small-ticket investors.</li>
            <li>Equity exposure is sized to the user appetite from the six-question profile.</li>
          </ul>
        </article>
      </section>
    </>
  );
}

function App() {
  const [activePage, setActivePage] = useState("overview");
  const [profiles, setProfiles] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("u001");
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(defaultAnswers);
  const [investment, setInvestment] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetchJson("/api/demo/summary"),
      fetchJson("/api/demo/profiles"),
      fetchJson("/api/demo/investment/questions"),
    ])
      .then(([summaryData, profileData, questionData]) => {
        setSummary(summaryData);
        setProfiles(profileData);
        setQuestions(questionData);
        setSelectedUserId(profileData[0]?.id || "u001");
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;
    fetchJson(`/api/demo/profiles/${selectedUserId}/assessment`)
      .then(setAssessment)
      .catch((err) => setError(err.message));
  }, [selectedUserId]);

  useEffect(() => {
    fetchJson("/api/demo/investment/assess", {
      method: "POST",
      body: JSON.stringify({ answers }),
    })
      .then(setInvestment)
      .catch((err) => setError(err.message));
  }, [answers]);

  if (status === "loading") {
    return <main className="loadingState">Loading CreditMiners...</main>;
  }

  if (status === "error") {
    return (
      <main className="loadingState">
        <h1>CreditMiners API is not reachable</h1>
        <p>Start the backend on port 5000, then refresh this page.</p>
        <code>{error}</code>
      </main>
    );
  }

  return (
    <main className="appShell">
      <Header activePage={activePage} setActivePage={setActivePage} />

      {activePage === "overview" && (
        <Overview
          profiles={profiles}
          setActivePage={setActivePage}
          setSelectedUserId={setSelectedUserId}
          summary={summary}
        />
      )}

      {activePage === "profiles" && (
        <Profiles
          assessment={assessment}
          profiles={profiles}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
        />
      )}

      {activePage === "risk" && (
        <RiskWizard
          answers={answers}
          investment={investment}
          questions={questions}
          setActivePage={setActivePage}
          setAnswers={setAnswers}
        />
      )}

      {activePage === "advisor" && <Advisor investment={investment} />}

      <footer className="disclaimer">
        For educational purposes only. This is not regulated financial advice, credit approval, or an investment
        recommendation from a licensed advisor. Prototype uses synthetic consent-style sample data.
      </footer>
    </main>
  );
}

export default App;
