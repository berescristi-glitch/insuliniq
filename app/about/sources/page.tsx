import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const metadata = {
  title: "Academic Sources & Research References | InsulinIQ",
  description:
    "The peer-reviewed studies, clinical guidelines, and systematic reviews that underpin all educational content on InsulinIQ. Every major claim is traceable to a verifiable source.",
};

interface Source {
  id: string;
  citation: string;
  journal: string;
  year: number;
  evidenceLevel: "Strong" | "Moderate" | "Emerging";
  usedIn: string[];
  pubmedId?: string;
  doi?: string;
}

const sources: Source[] = [
  // ── Insulin Resistance ──────────────────────────────────────────────
  {
    id: "petersen-shulman-2018",
    citation:
      "Petersen, M.C. & Shulman, G.I. (2018). Mechanisms of insulin action and insulin resistance.",
    journal: "Physiological Reviews, 98(4), 2133–2223.",
    year: 2018,
    evidenceLevel: "Strong",
    usedIn: ["What Is Insulin Resistance", "Nutrition", "Obesity"],
    pubmedId: "30203336",
    doi: "10.1152/physrev.00063.2017",
  },
  {
    id: "reaven-1988",
    citation:
      "Reaven, G.M. (1988). Banting Lecture 1988: role of insulin resistance in human disease.",
    journal: "Diabetes, 37(12), 1595–1607.",
    year: 1988,
    evidenceLevel: "Strong",
    usedIn: ["Metabolic Syndrome", "Nutrition"],
    pubmedId: "3056758",
    doi: "10.2337/diab.37.12.1595",
  },
  {
    id: "samuel-shulman-2012",
    citation:
      "Samuel, V.T. & Shulman, G.I. (2012). Mechanisms for insulin resistance: common threads and missing links.",
    journal: "Cell, 148(5), 852–871.",
    year: 2012,
    evidenceLevel: "Strong",
    usedIn: ["Metabolic Syndrome", "NAFLD / MASLD", "Nutrition"],
    pubmedId: "22424228",
    doi: "10.1016/j.cell.2012.01.017",
  },
  // ── Diabetes Prevention ─────────────────────────────────────────────
  {
    id: "knowler-2002-dpp",
    citation:
      "Knowler, W.C. et al. / Diabetes Prevention Program Research Group. (2002). Reduction in the Incidence of Type 2 Diabetes with Lifestyle Intervention or Metformin.",
    journal: "New England Journal of Medicine, 346(6), 393–403.",
    year: 2002,
    evidenceLevel: "Strong",
    usedIn: ["Prediabetes", "What Is Insulin Resistance", "Metabolic Syndrome", "Nutrition"],
    pubmedId: "11832527",
    doi: "10.1056/NEJMoa012512",
  },
  {
    id: "tabak-2012",
    citation:
      "Tabák, A.G. et al. (2012). Prediabetes: a high-risk state for diabetes development.",
    journal: "The Lancet, 379(9833), 2279–2290.",
    year: 2012,
    evidenceLevel: "Strong",
    usedIn: ["Prediabetes"],
    pubmedId: "22683128",
    doi: "10.1016/S0140-6736(12)60283-9",
  },
  {
    id: "colberg-2016",
    citation:
      "Colberg, S.R. et al. (2016). Physical activity/exercise and diabetes: a position statement of the American Diabetes Association.",
    journal: "Diabetes Care, 39(11), 2065–2079.",
    year: 2016,
    evidenceLevel: "Strong",
    usedIn: ["Prediabetes"],
    pubmedId: "27926890",
    doi: "10.2337/dc16-1728",
  },
  {
    id: "richter-hargreaves-2013",
    citation:
      "Richter, E.A. & Hargreaves, M. (2013). Exercise, GLUT4, and skeletal muscle glucose uptake.",
    journal: "Physiological Reviews, 93(3), 993–1017.",
    year: 2013,
    evidenceLevel: "Strong",
    usedIn: ["Prediabetes", "What Is Insulin Resistance"],
    pubmedId: "23899560",
    doi: "10.1152/physrev.00038.2012",
  },
  // ── Mediterranean Diet / Nutrition ──────────────────────────────────
  {
    id: "estruch-2018-predimed",
    citation:
      "Estruch, R. et al. / PREDIMED Study Investigators. (2018). Primary prevention of cardiovascular disease with a Mediterranean diet supplemented with extra-virgin olive oil or nuts [corrected].",
    journal: "New England Journal of Medicine, 378(25), e34.",
    year: 2018,
    evidenceLevel: "Strong",
    usedIn: ["Metabolic Syndrome", "Nutrition", "NAFLD / MASLD"],
    pubmedId: "29897866",
    doi: "10.1056/NEJMoa1800389",
  },
  {
    id: "salas-salvado-2011",
    citation:
      "Salas-Salvadó, J. et al. (2011). Reduction in the incidence of type 2 diabetes with the Mediterranean diet: results of the PREDIMED-Reus nutrition intervention randomized trial.",
    journal: "Diabetes Care, 34(1), 14–19.",
    year: 2011,
    evidenceLevel: "Strong",
    usedIn: ["Nutrition"],
    pubmedId: "20929998",
    doi: "10.2337/dc10-1288",
  },
  {
    id: "livesey-2019",
    citation:
      "Livesey, G. et al. (2019). Dietary glycemic index and load and the risk of type 2 diabetes: assessment of causal relations.",
    journal: "BMJ, 366, l2368.",
    year: 2019,
    evidenceLevel: "Strong",
    usedIn: ["Nutrition"],
    pubmedId: "31196885",
    doi: "10.1136/bmj.l2368",
  },
  // ── PCOS ────────────────────────────────────────────────────────────
  {
    id: "teede-2023",
    citation:
      "Teede, H.J. et al. (2023). Recommendations from the 2023 international evidence-based guideline for the assessment and management of polycystic ovary syndrome.",
    journal: "Journal of Clinical Endocrinology & Metabolism, 108(10), 2447–2469.",
    year: 2023,
    evidenceLevel: "Strong",
    usedIn: ["PCOS", "Metabolic Syndrome", "Nutrition"],
    pubmedId: "37290109",
    doi: "10.1210/clinem/dgad463",
  },
  {
    id: "cassar-2016",
    citation:
      "Cassar, S. et al. (2016). Insulin resistance in polycystic ovary syndrome: a systematic review and meta-analysis of euglycaemic-hyperinsulinaemic clamp studies.",
    journal: "Human Reproduction, 31(11), 2619–2631.",
    year: 2016,
    evidenceLevel: "Strong",
    usedIn: ["PCOS"],
    pubmedId: "27466394",
    doi: "10.1093/humrep/dew243",
  },
  {
    id: "dunaif-1997",
    citation:
      "Dunaif, A. (1997). Insulin resistance and the polycystic ovary syndrome: mechanism and implications for pathogenesis.",
    journal: "Endocrine Reviews, 18(6), 774–800.",
    year: 1997,
    evidenceLevel: "Strong",
    usedIn: ["PCOS"],
    pubmedId: "9408743",
    doi: "10.1210/edrv.18.6.0318",
  },
  {
    id: "patten-2020",
    citation:
      "Patten, R.K. et al. (2020). Exercise interventions in polycystic ovary syndrome: a systematic review and meta-analysis.",
    journal: "Frontiers in Physiology, 11, 606.",
    year: 2020,
    evidenceLevel: "Moderate",
    usedIn: ["PCOS"],
    pubmedId: "32848820",
    doi: "10.3389/fphys.2020.00606",
  },
  {
    id: "escobar-morreale-2018",
    citation:
      "Escobar-Morreale, H.F. (2018). Polycystic ovary syndrome: definition, aetiology, diagnosis and treatment.",
    journal: "Nature Reviews Endocrinology, 14(5), 270–284.",
    year: 2018,
    evidenceLevel: "Strong",
    usedIn: ["PCOS"],
    pubmedId: "29569621",
    doi: "10.1038/nrendo.2018.24",
  },
  // ── NAFLD / MASLD ───────────────────────────────────────────────────
  {
    id: "younossi-2023",
    citation:
      "Younossi, Z.M. et al. (2023). Global epidemiology of nonalcoholic fatty liver disease / metabolic dysfunction-associated steatotic liver disease: new nomenclature.",
    journal: "Clinical Gastroenterology and Hepatology, 21(8), 1978–1991.",
    year: 2023,
    evidenceLevel: "Strong",
    usedIn: ["NAFLD / MASLD"],
    pubmedId: "36544579",
    doi: "10.1016/j.cgh.2022.11.032",
  },
  {
    id: "hashida-2017",
    citation:
      "Hashida, R. et al. (2017). Aerobic vs. resistance exercise in non-alcoholic fatty liver disease: a systematic review.",
    journal: "Journal of Hepatology, 66(1), 142–152.",
    year: 2017,
    evidenceLevel: "Moderate",
    usedIn: ["NAFLD / MASLD"],
    pubmedId: "27639843",
    doi: "10.1016/j.jhep.2016.08.023",
  },
  {
    id: "rinella-2023",
    citation:
      "Rinella, M.E. et al. (2023). A multisociety Delphi consensus statement on new fatty liver disease nomenclature.",
    journal: "Hepatology, 78(6), 1966–1986.",
    year: 2023,
    evidenceLevel: "Strong",
    usedIn: ["NAFLD / MASLD", "Metabolic Syndrome"],
    pubmedId: "37363821",
    doi: "10.1097/HEP.0000000000000520",
  },
  // ── Metabolic Syndrome ──────────────────────────────────────────────
  {
    id: "aguilar-2015",
    citation:
      "Aguilar, M. et al. (2015). Prevalence of the metabolic syndrome in the United States, 2003–2012.",
    journal: "JAMA, 313(19), 1973–1974.",
    year: 2015,
    evidenceLevel: "Strong",
    usedIn: ["Metabolic Syndrome"],
    pubmedId: "25988463",
    doi: "10.1001/jama.2015.4260",
  },
  {
    id: "alberti-2009",
    citation:
      "Alberti, K.G.M.M. et al. (2009). Harmonizing the metabolic syndrome: a joint interim statement.",
    journal: "Circulation, 120(16), 1640–1645.",
    year: 2009,
    evidenceLevel: "Strong",
    usedIn: ["Metabolic Syndrome"],
    pubmedId: "19805654",
    doi: "10.1161/CIRCULATIONAHA.109.192644",
  },
  {
    id: "mottillo-2010",
    citation:
      "Mottillo, S. et al. (2010). The metabolic syndrome and cardiovascular risk: a systematic review and meta-analysis.",
    journal: "Journal of the American College of Cardiology, 56(14), 1113–1132.",
    year: 2010,
    evidenceLevel: "Strong",
    usedIn: ["Metabolic Syndrome"],
    pubmedId: "20863953",
    doi: "10.1016/j.jacc.2010.05.034",
  },
  {
    id: "sattar-2008",
    citation:
      "Sattar, N. et al. (2008). Metabolic syndrome with and without C-reactive protein as a predictor of coronary heart disease and diabetes.",
    journal: "Lancet, 371(9628), 1927–1935.",
    year: 2008,
    evidenceLevel: "Strong",
    usedIn: ["Metabolic Syndrome"],
    pubmedId: "18501419",
    doi: "10.1016/S0140-6736(08)60859-9",
  },
  // ── Obesity ─────────────────────────────────────────────────────────
  {
    id: "shulman-2014",
    citation:
      "Shulman, G.I. (2014). Ectopic fat in insulin resistance, dyslipidemia, and cardiometabolic disease.",
    journal: "New England Journal of Medicine, 371(12), 1131–1141.",
    year: 2014,
    evidenceLevel: "Strong",
    usedIn: ["Obesity"],
    pubmedId: "25265322",
    doi: "10.1056/NEJMra1011035",
  },
  {
    id: "hall-2019",
    citation:
      "Hall, K.D. et al. (2019). Ultra-processed diets cause excess calorie intake and weight gain: an inpatient randomized controlled trial.",
    journal: "Cell Metabolism, 30(1), 67–77.",
    year: 2019,
    evidenceLevel: "Strong",
    usedIn: ["Obesity", "Nutrition"],
    pubmedId: "31105044",
    doi: "10.1016/j.cmet.2019.05.008",
  },
  {
    id: "lean-2018",
    citation:
      "Lean, M.E. et al. (2018). Primary care-led weight management for remission of type 2 diabetes (DiRECT): an open-label, cluster-randomised trial.",
    journal: "The Lancet, 391(10120), 541–551.",
    year: 2018,
    evidenceLevel: "Strong",
    usedIn: ["Obesity"],
    pubmedId: "29221645",
    doi: "10.1016/S0140-6736(17)33102-1",
  },
  {
    id: "magkos-2016",
    citation:
      "Magkos, F. et al. (2016). Effects of moderate and subsequent progressive weight loss on metabolic function and adipose tissue biology in humans with obesity.",
    journal: "Cell Metabolism, 23(4), 591–601.",
    year: 2016,
    evidenceLevel: "Strong",
    usedIn: ["Obesity"],
    pubmedId: "27133130",
    doi: "10.1016/j.cmet.2016.02.005",
  },
  {
    id: "spiegel-2004",
    citation:
      "Spiegel, K. et al. (2004). Sleep curtailment in healthy young men is associated with decreased leptin levels, elevated ghrelin levels, and increased hunger and appetite.",
    journal: "Annals of Internal Medicine, 141(11), 846–850.",
    year: 2004,
    evidenceLevel: "Moderate",
    usedIn: ["Obesity"],
    pubmedId: "15583226",
    doi: "10.7326/0003-4819-141-11-200412070-00008",
  },
  // ── Gut Microbiome ──────────────────────────────────────────────────
  {
    id: "sender-2016",
    citation:
      "Sender, R. et al. (2016). Revised estimates for the number of human and bacteria cells in the body.",
    journal: "Cell, 164(3), 337–340.",
    year: 2016,
    evidenceLevel: "Strong",
    usedIn: ["Gut Microbiome"],
    pubmedId: "27584009",
    doi: "10.1016/j.cell.2016.01.013",
  },
  {
    id: "canfora-2015",
    citation:
      "Canfora, E.E. et al. (2015). Short-chain fatty acids in control of body weight and insulin sensitivity.",
    journal: "Nature Reviews Endocrinology, 11(10), 577–591.",
    year: 2015,
    evidenceLevel: "Strong",
    usedIn: ["Gut Microbiome", "Nutrition"],
    pubmedId: "26303384",
    doi: "10.1038/nrendo.2015.128",
  },
  {
    id: "wastyk-2021",
    citation:
      "Wastyk, H.C. et al. (2021). Gut-microbiota-targeted diets modulate human immune status.",
    journal: "Cell, 184(16), 4137–4153.",
    year: 2021,
    evidenceLevel: "Moderate",
    usedIn: ["Gut Microbiome", "Nutrition"],
    pubmedId: "34256014",
    doi: "10.1016/j.cell.2021.06.019",
  },
  {
    id: "sonnenburg-backhed-2016",
    citation:
      "Sonnenburg, J.L. & Bäckhed, F. (2016). Diet–microbiota interactions as moderators of human metabolism.",
    journal: "Nature, 535(7610), 56–64.",
    year: 2016,
    evidenceLevel: "Strong",
    usedIn: ["Gut Microbiome", "Nutrition"],
    pubmedId: "27383980",
    doi: "10.1038/nature18846",
  },
];

const evidenceBadge = {
  Strong: "bg-forest-100 text-forest-700 border-forest-200",
  Moderate: "bg-honey-100 text-honey-700 border-honey-200",
  Emerging: "bg-sage-100 text-sage-700 border-sage-200",
};

const pageGroups: { label: string; ids: string[] }[] = [
  {
    label: "Insulin Resistance",
    ids: ["petersen-shulman-2018", "reaven-1988", "samuel-shulman-2012"],
  },
  {
    label: "Prediabetes & Diabetes Prevention",
    ids: ["knowler-2002-dpp", "tabak-2012", "colberg-2016", "richter-hargreaves-2013"],
  },
  {
    label: "Mediterranean Diet & Nutrition",
    ids: ["estruch-2018-predimed", "salas-salvado-2011", "livesey-2019"],
  },
  {
    label: "PCOS",
    ids: ["teede-2023", "cassar-2016", "dunaif-1997", "patten-2020", "escobar-morreale-2018"],
  },
  {
    label: "Fatty Liver Disease (NAFLD / MASLD)",
    ids: ["younossi-2023", "hashida-2017", "rinella-2023"],
  },
  {
    label: "Metabolic Syndrome",
    ids: ["aguilar-2015", "alberti-2009", "mottillo-2010", "sattar-2008"],
  },
  {
    label: "Obesity & Weight",
    ids: ["shulman-2014", "hall-2019", "lean-2018", "magkos-2016", "spiegel-2004"],
  },
  {
    label: "Gut Microbiome",
    ids: ["sender-2016", "canfora-2015", "wastyk-2021", "sonnenburg-backhed-2016"],
  },
];

const byId = Object.fromEntries(sources.map((s) => [s.id, s]));

export default function SourcesPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-14">
          <Link
            href="/about/scientific-integrity"
            className="text-sm text-forest-600 hover:underline mb-4 inline-block"
          >
            ← Scientific Integrity
          </Link>
          <h1 className="text-4xl font-extrabold text-foreground mb-4">
            Research Sources
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Every substantive claim on InsulinIQ is traceable to a peer-reviewed source. This
            page lists all primary references cited across the platform, grouped by topic, with
            direct links to PubMed and publisher DOI where available.
          </p>
          <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border text-sm text-muted-foreground">
            <strong className="text-foreground">Evidence levels</strong> reflect the type of
            study, not the clinical certainty of a claim.{" "}
            <span className="font-medium text-forest-700">Strong</span> = large RCTs,
            meta-analyses, or systematic reviews in high-impact journals.{" "}
            <span className="font-medium text-honey-700">Moderate</span> = smaller RCTs,
            observational studies, or mechanistic reviews.{" "}
            <span className="font-medium text-sage-700">Emerging</span> = early-stage research,
            animal models, or proof-of-concept studies.
          </div>
        </div>

        {/* Groups */}
        <div className="space-y-14">
          {pageGroups.map((group) => (
            <section key={group.label}>
              <h2 className="text-xl font-bold text-foreground mb-6 pb-2 border-b border-border">
                {group.label}
              </h2>
              <div className="space-y-4">
                {group.ids.map((id) => {
                  const s = byId[id];
                  if (!s) return null;
                  return (
                    <div
                      key={id}
                      className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <p className="text-sm font-medium text-foreground leading-relaxed flex-1">
                          {s.citation}
                        </p>
                        <span
                          className={`flex-shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${evidenceBadge[s.evidenceLevel]}`}
                        >
                          {s.evidenceLevel}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground italic">{s.journal}</p>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {/* Links */}
                        {s.pubmedId && (
                          <a
                            href={`https://pubmed.ncbi.nlm.nih.gov/${s.pubmedId}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-forest-600 hover:underline"
                          >
                            PubMed
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {s.doi && (
                          <a
                            href={`https://doi.org/${s.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                          >
                            DOI: {s.doi}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}

                        {/* Used in */}
                        <div className="ml-auto flex flex-wrap gap-1.5">
                          {s.usedIn.map((page) => (
                            <span
                              key={page}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground"
                            >
                              {page}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 rounded-2xl border border-border bg-secondary/30 p-6 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-2">A note on citation completeness</p>
          <p className="leading-relaxed">
            This page is updated whenever new content is published or existing citations are
            refined. If you notice a citation that appears incorrect or insufficiently
            specific, please contact us at{" "}
            <a href="mailto:support@insuliniq.com" className="text-forest-600 hover:underline">
              support@insuliniq.com
            </a>
            . Scientific accuracy is foundational to this platform and we take corrections
            seriously.
          </p>
          <p className="mt-3 leading-relaxed">
            For the complete reference lists used within individual articles, see the Sources
            section at the bottom of each article page.
          </p>
        </div>

      </div>
    </div>
  );
}
