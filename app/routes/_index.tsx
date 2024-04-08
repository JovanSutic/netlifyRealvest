import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Column, Line, Page } from "../components/layout";
import { json } from "@remix-run/node";
import { NavLink, useLoaderData, useSearchParams } from "@remix-run/react";
import { default as ErrorPage } from "../components/error";
import { isMobile } from "../utils/params";
import {
  Box,
  Button,
  Divider,
  FormControl,
  List,
  ListItem,
  ListItemIcon,
  OutlinedInput,
  Typography,
} from "@mui/material";
import {
  CheckCircleOutline,
  Insights,
  Reviews,
  AspectRatio,
  Scale,
} from "@mui/icons-material";
import { getDayInYear } from "../utils/dateTime";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  return json({ ok: true, mobile: isMobile(userAgent!) });
};

export default function Index() {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  console.log(lang);

  const {
    mobile,
  }: {
    mobile: boolean;
  } = useLoaderData();

  return (
    <>
      <Page mobile={mobile}>
        <Line mobile={mobile}>
          <Column size={5}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "760px",
                alignSelf: "center",
                alignItems: "center",
                paddingTop: "12px",
                paddingBottom: "36px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: "40px",
                  fontWeight: "500",
                  color: "#06173d",
                  marginBottom: "12px",
                }}
              >
                Platforma za ljude koji ulažu u nekretnine
              </Typography>
              {/* <Typography
              variant="h6"
              sx={{
                fontWeight: "300",
                lineHeight: "24px",
                color: "#06173d",
              }}
            >
              Donosite kupovne odluke sa više samopouzdanja i podržite svoje
              investicione izbore čvrstim podacima.
            </Typography> */}
              <Button
                variant="contained"
                sx={{
                  background: "#f0b90b",
                  color: "#06173d",
                  width: "400px",
                  marginTop: "28px",
                  "& a": {
                    color: "#14182d",
                    fontStyle: "none",
                    textDecoration: "none",
                  },
                  "&:hover": {
                    background: "#fcd535",
                  },
                }}
              >
                <NavLink
                  to={`dashboard/?lang=sr&time_range=3m&property_type=residential&municipality=1&distribution_type=price_map`}
                >
                  Pogledaj podatke za Beograd
                </NavLink>
              </Button>
            </Box>

            <Divider />
          </Column>
        </Line>
        <Line mobile={mobile}>
          <Column size={5}>
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
          </Column>
        </Line>
      </Page>
      <Page mobile={mobile} color="#06173d">
        <Line mobile={mobile}>
          <Column size={5}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "800px",
                alignSelf: "center",
                alignItems: "center",
                paddingTop: "30px",
                paddingBottom: "30px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: "24px",
                  fontWeight: "300",
                  color: "#fff",
                  marginBottom: "12px",
                }}
              >
                Ukoliko aktivno investirate u nekretnine ili to čine vaši
                klijenti. Iskoristite ovu priliku i zatražite rani pristup.
              </Typography>
            </Box>
          </Column>
        </Line>
      </Page>
    </>
  );
}

export function ErrorBoundary() {
  return <ErrorPage link={"/"} />;
}
