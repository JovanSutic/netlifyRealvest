import { NavLink, useLocation, useSearchParams } from "@remix-run/react";
import styles from "./styles.module.css";
import Button from "../button";
import {
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import Dropdown from "../dropdown";
import { Translator } from "../../data/language/translator";
import { useEffect, useState } from "react";
import { LangType } from "../../types/dashboard.types";

const MobileMenu = ({
  drawerWidth,
  onClose,
  onLangChange,
  open,
  lang,
  pathname,
}: {
  drawerWidth: number;
  onClose: () => void;
  onLangChange: (value: string) => void;
  open: boolean;
  lang: LangType;
  pathname: string;
}) => {
  const translator = new Translator("navigation");

  useEffect(() => {
    onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
      onClose={onClose}
      variant="persistent"
      anchor="right"
      transitionDuration={600}
      open={open}
    >
      <List>
        <ListItem>
          <ListItemButton>
            <NavLink
              to={`/dashboard/?lang=${lang}&time_range=3m&property_type=residential&municipality=1&distribution_type=price_map`}
              className={
                pathname === "/"
                  ? `${styles.linkMobile} ${styles.active}`
                  : `${styles.linkMobile}`
              }
            >
              {translator.getTranslation(lang || "sr", "dashboardNav")}
            </NavLink>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <NavLink
              to={`/portfolio/?lang=${lang}`}
              className={
                pathname === "/portfolio/"
                  ? `${styles.linkMobile} ${styles.active}`
                  : `${styles.linkMobile}`
              }
            >
              {translator.getTranslation(lang || "sr", "portfolioNav")}
            </NavLink>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <NavLink
              to={`/partnership/?lang=${lang}`}
              className={
                pathname === "/partnership/"
                  ? `${styles.linkMobile} ${styles.active}`
                  : `${styles.linkMobile}`
              }
            >
              {translator.getTranslation(lang || "sr", "partnershipNav")}
            </NavLink>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <Dropdown
              name={lang || "sr"}
              options={[
                { value: "en", text: "en" },
                { value: "sr", text: "sr" },
              ]}
              onChange={onLangChange}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

function Navigation({ mobile }: { mobile: boolean }) {
  const [open, setOpen] = useState<boolean>(false);
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = searchParams.get("lang") as LangType;
  const translator = new Translator("navigation");

  const isUser = false;

  return (
    <nav className={styles.root}>
      {!mobile && (
        <div className={styles.startNavigation}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="logo" />
          </div>
          <ul className={styles.navigationList}>
            <li className={styles.navigationItem}>
              <NavLink
                to={`/dashboard/?lang=${lang}&time_range=3m&property_type=residential&municipality=1&distribution_type=price_map`}
                className={
                  pathname === "/dashboard/"
                    ? `${styles.link} ${styles.active}`
                    : `${styles.link}`
                }
              >
                {translator.getTranslation(lang || "sr", "dashboardNav")}
              </NavLink>
            </li>
            <li className={styles.navigationItem}>
              <NavLink
                to={`/portfolio/?lang=${lang}`}
                className={
                  pathname === "/portfolio/"
                    ? `${styles.link} ${styles.active}`
                    : `${styles.link}`
                }
              >
                {translator.getTranslation(lang || "sr", "portfolioNav")}
              </NavLink>
            </li>
            <li className={styles.navigationItem}>
              <NavLink
                to={`/partnership/?lang=${lang}`}
                className={
                  pathname === "/partnership/"
                    ? `${styles.link} ${styles.active}`
                    : `${styles.link}`
                }
              >
                {translator.getTranslation(lang || "sr", "partnershipNav")}
              </NavLink>
            </li>
          </ul>
        </div>
      )}
      {!mobile ? (
        <div className={styles.endNavigation}>
          <Dropdown
            name={lang || "sr"}
            options={[
              { value: "en", text: "en" },
              { value: "sr", text: "sr" },
            ]}
            onChange={(value) => {
              setSearchParams((prev) => {
                prev.set("lang", value);
                return prev;
              });
            }}
          />
          {isUser && (
            <Avatar
              sx={{
                width: " 36px",
                height: "36px",
                borderRadius: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0b90b",
                fontSize: "15px",
                lineHeight: "1",
                color: "#0b0e11",
                fontWeight: "500",
                alignSelf: "center",
              }}
            >
              JD
            </Avatar>
          )}

          <div className={styles.buttons}>
            {isUser ? (
              <Button
                text={translator.getTranslation(lang || "sr", "logoutNav")}
                size="small"
                variant="tertiary"
                onClick={() => console.log("Logout")}
              />
            ) : (
              <Button
                text={translator.getTranslation(lang || "sr", "loginNav")}
                size="small"
                variant="secondary"
                onClick={() => console.log("login")}
              />
            )}
          </div>
        </div>
      ) : (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={() => setOpen(!open)}
          sx={{ display: "flex", color: "#f0b90b" }}
        >
          <Menu />
        </IconButton>
      )}

      {mobile && (
        <MobileMenu
          open={open}
          pathname={pathname}
          lang={lang}
          onClose={() => setOpen(false)}
          drawerWidth={240}
          onLangChange={(value: string) => {
            setSearchParams((prev) => {
              prev.set("lang", value);
              return prev;
            });
          }}
        />
      )}
    </nav>
  );
}

export default Navigation;
