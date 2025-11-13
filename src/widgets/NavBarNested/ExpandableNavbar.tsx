import { useMemo, useState } from "react";
import { Paper, useMantineTheme } from "@mantine/core";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { motion, AnimatePresence } from "framer-motion";
import NavbarNested from "./NavBarNested";
import classes from "./classes/ExpandableNavbar.module.css";

type Props = {
  headerHeight: number;
  collapsedWidth: number;
  expandedWidth: number;
  burgerOpened: boolean;
  onCloseMobile: () => void;
};

export default function ExpandableNavbar({
  headerHeight,
  collapsedWidth,
  expandedWidth,
  burgerOpened,
  onCloseMobile,
}: Props) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { width: vw } = useViewportSize();

  const [hovered, setHovered] = useState(false);
  const expanded = isMobile ? burgerOpened : hovered;

  const targetWidth = useMemo(() => {
    if (isMobile) return expanded ? vw : collapsedWidth;
    return expanded ? expandedWidth : collapsedWidth;
  }, [isMobile, expanded, vw, collapsedWidth, expandedWidth]);

  return (
    <>
      <motion.aside
        className={classes.navRoot}
        style={{ top: headerHeight }}
        onMouseEnter={!isMobile ? () => setHovered(true) : undefined}
        onMouseLeave={!isMobile ? () => setHovered(false) : undefined}
        initial={false}
        animate={{ width: targetWidth, transition: { bounce: 0 } }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      >
        <Paper className={classes.navPaper} radius={0} withBorder>
          <NavbarNested expanded={expanded} />
        </Paper>
      </motion.aside>

      <AnimatePresence>
        {isMobile && expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>
    </>
  );
}
