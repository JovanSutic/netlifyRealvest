import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { TColumn, TLine, TPage } from "../components/layout";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { default as ErrorPage } from "../components/error";
import { isMobile } from "../utils/params";
import IndexCard from "../components/card/IndexCard";

export const meta: MetaFunction = () => {
  return [
    { title: "Realvest" },
    { name: "description", content: "Welcome to Realvest" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  return json({ ok: true, mobile: isMobile(userAgent!) });
};

export default function Index() {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "sr";

  const {
    mobile,
  }: {
    mobile: boolean;
  } = useLoaderData();

  return (
    <>
      <TPage mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <div className="text-[#333] p-6 mb-6">
              <div className="text-center max-w-4xl max-md:max-w-md mx-auto">
                <div>
                  <p className="text-sm font-bold text-indigo-500 mb-4">
                    <span className="rotate-90 inline-block mr-2">|</span> ALL
                    IN ONE REAL ESTATE INVESTMENT DATA
                  </p>
                  <h2 className="md:text-5xl text-3xl font-extrabold mb-4 md:!leading-[55px]">
                    Buy real estate with more confidence
                  </h2>
                  <p className="mt-8 text-base text-gray-500 leading-relaxed">
                    Access reliable real estate insights on our platform. Make
                    informed investment decisions backed by data and expertise.
                  </p>
                  <div className="flex flex-row w-full justify-center mt-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full sm:w-96 bg-gray-50 py-3.5 px-4 text-[#333] text-base focus:outline-none rounded"
                    />
                    <button className="max-sm:mt-8 sm:ml-4 bg-indigo-900 hover:bg-indigo-800 text-white text-base font-semibold py-3.5 px-6 rounded hover:shadow-md hover:transition-transform transition-transform hover:scale-105 focus:outline-none">
                      Join the Waiting List
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TColumn>
        </TLine>
        <TLine columns={3} gap={4}>
          <TColumn span={1} start={1}>
            <div className="flex flex-col items-center mb-14">
              <IndexCard
                title="Belgrade sales report"
                text="Discover comprehensive insights into Belgrade real estate analytics with our detailed sales report. Gain valuable data on prices, market trends, and key historical data points in an easy to use dashboard."
                link={`/dashboard/?lang=${lang}`}
                image="/dashboard2.jpg"
                buttonText="Go to"
              />
            </div>
          </TColumn>
          <TColumn span={1} start={2}>
            <div className="flex flex-col items-center mb-14">
              <IndexCard
                title="Rental income calculator"
                text="Unlock the earning power of your investment property. Our service provides comprehensive estimates of rental income for both short and long-term leases, enabling you to make good investment decisions."
              />
            </div>
          </TColumn>
          <TColumn span={1} start={3}>
            <div className="flex flex-col items-center mb-14">
              <IndexCard
                title="Capital appreciation"
                text="Gain foresight into property value growth. Our cutting-edge service accurately predicts capital appreciation, guiding smart investment decisions for sustainable returns in the real estate market."
              />
            </div>
          </TColumn>
        </TLine>
        <TLine columns={3} gap={4}>
          <TColumn span={1} start={1}>
            <div className="flex flex-col items-center mb-10">
              <IndexCard
                title="Investment opportunities"
                text="Navigate the property market with confidence. Our comprehensive service curates the best investment opportunities, providing insights to maximize your returns and grow your portfolio strategically."
              />
            </div>
          </TColumn>
          <TColumn span={1} start={2}>
            <div className="flex flex-col items-center mb-10">
              <IndexCard
                title="Data drill down"
                text="Unlock nuanced property insights. Our advanced service enables users to delve deeper into location and time data, empowering informed decisions for strategic investments."
              />
            </div>
          </TColumn>
          <TColumn span={1} start={3}>
            <div className="flex flex-col items-center mb-10">
              <IndexCard
                title="New markets"
                text="Capture insights across diverse markets. Our service consolidates property investment data from different geographies, fostering well-rounded decision-making."
              />
            </div>
          </TColumn>
        </TLine>

        {/* <TLine columns={1}>
          <TColumn span={1}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                marginTop: "40px",
                marginBottom: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "360px",
                  padding: "20px",
                  background: "#06173d",
                  borderRadius: "8px",
                  height: "fit-content",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#fff",
                    textAlign: "center",
                  }}
                >
                  Rani pristup
                </Typography>
                <List>
                  <ListItem>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#fff",
                        fontWeight: 300,
                        lineHeight: "22px",
                        textAlign: "justify",
                      }}
                    >
                      Pristup beta verziji aplikacije, pre javnog lansiranja
                      proizvoda.
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#fff",
                        fontWeight: 500,
                        lineHeight: "22px",
                        textAlign: "justify",
                      }}
                    >
                      Sniženu cenu godišnjeg pristupa aplikaciji. Popust od 50%.
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#fff",
                        fontWeight: 300,
                        lineHeight: "22px",
                        textAlign: "justify",
                      }}
                    >
                      Mogućnost uticaja na funckionalnosti koje će biti dostupne
                      u aplikaciji.
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#fff",
                        fontWeight: 300,
                        lineHeight: "22px",
                        textAlign: "justify",
                      }}
                    >
                      Prvi uvid u nova tržišta, nove funckionalnosti i nove
                      investicione prilike.
                    </Typography>
                  </ListItem>
                </List>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: "12px",
                    fontWeight: "300",
                    marginTop: "8px",
                    color: "#fff",
                  }}
                >
                  {`Dostupno još samo ${200 - getDayInYear()} mesta.`}
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    width: "320px",
                    margin: "0px",
                    marginTop: "4px",
                    marginBottom: "16px",
                  }}
                  variant="outlined"
                >
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    aria-describedby="outlined-weight-helper-text"
                    placeholder="Email"
                    label="Vaš email"
                    inputProps={{
                      "aria-label": "Email",
                    }}
                    sx={{
                      background: "#fff",
                      "& input": {
                        padding: "12px 14px",
                      },
                    }}
                  />
                </FormControl>
                <Button
                  variant="contained"
                  sx={{
                    background: "#f0b90b",
                    color: "#06173d",
                    "&:hover": {
                      background: "#fcd535",
                    },
                  }}
                >
                  Želim rani pristup
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "0px 40px",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#06173d",
                      textAlign: "center",
                      marginBottom: "16px",
                    }}
                  >
                    Šta mogu da očekujem od platforme?
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <AspectRatio
                          sx={{
                            color: "#06173d",
                            fontSize: "32px",
                          }}
                        />
                      </ListItemIcon>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: "22px",
                          textAlign: "justify",
                        }}
                      >
                        <b>Uvid u uspešnost ličnog portfolija nekretnina. </b>
                        Možete videti koliko se tačno povećala realna vrednost
                        nekretnina u vašem vlasništvu, odnosno da li je
                        investicija uspešna ili ne.
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Scale
                          sx={{
                            color: "#06173d",
                            fontSize: "32px",
                          }}
                        />
                      </ListItemIcon>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: "22px",
                          textAlign: "justify",
                        }}
                      >
                        <b>Podatke o prihodnim mogućnostima nekretnina. </b>
                        Saznajte koliko možete zaraditi kratkoročnim ili
                        dugoročnim izdavanjem i da li je to za vas isplativo.
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Reviews
                          sx={{
                            color: "#06173d",
                            fontSize: "32px",
                          }}
                        />
                      </ListItemIcon>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: "22px",
                          textAlign: "justify",
                        }}
                      >
                        <b>Sugestije za nove investicione šanse.</b> Ukazaćemo
                        vam na ponude koje imaju dobar investicioni potencijal,
                        ali imaćete mogućnost da i sami pronađete dobre prilike
                        za investiranje.
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Insights
                          sx={{
                            color: "#06173d",
                            fontSize: "32px",
                          }}
                        />
                      </ListItemIcon>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: "22px",
                          textAlign: "justify",
                        }}
                      >
                        <b>Prikaz tržišnih trendova.</b> Ilustrovaćemo makro
                        trendove za celo tržište kao i mikro trendove vezane za
                        određene male delove tržišta.
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleOutline
                          sx={{
                            color: "#06173d",
                            fontSize: "32px",
                          }}
                        />
                      </ListItemIcon>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: "22px",
                          textAlign: "justify",
                        }}
                      >
                        <b>Više samopuzdanja.</b> Čvrsti podaci mogu vam pomoći
                        da budete sigurniji u svoje odluke i budete aktivniji i
                        uspešniji na tržištu.
                      </Typography>
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </Box>
          </TColumn>
        </TLine> */}
      </TPage>
      <TPage color="bg-indigo-950" mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <div className="bg-indigo-950 py-16 px-6 font-[sans-serif]">
              <div className="max-w-5xl mx-auto text-center text-white">
                <h2 className="text-4xl font-extrabold mb-4">
                  Get early access with 40% discount
                </h2>
                <p className="text-base text-gray-400">
                  Secure your spot on our exclusive waiting list for early
                  access. Join now to be first in line for groundbreaking real
                  estate data insights!
                </p>
                <div className="mt-10">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full sm:w-96 bg-gray-50 py-3.5 px-4 text-[#333] text-base focus:outline-none rounded"
                  />
                  <button className="max-sm:mt-8 sm:ml-4 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 text-base font-semibold py-3.5 px-6 rounded hover:shadow-md hover:transition-transform transition-transform hover:scale-105 focus:outline-none">
                    Join the Waiting List
                  </button>
                </div>
              </div>
            </div>
          </TColumn>
        </TLine>
      </TPage>
    </>
  );
}

export function ErrorBoundary() {
  return <ErrorPage link={"/"} />;
}
