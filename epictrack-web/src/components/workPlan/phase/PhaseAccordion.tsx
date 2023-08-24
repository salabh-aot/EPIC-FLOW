import { Box, Grid, LinearProgress, SxProps } from "@mui/material";
import React, { useContext } from "react";
import Moment from "moment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ETAccordion from "../../shared/accordion/Accordion";
import { PhaseAccordionProps } from "./type";
import ETAccordionSummary from "../../shared/accordion/components/AccordionSummary";
import { ETCaption1, ETParagraph } from "../../shared";
import { Palette } from "../../../styles/theme";
import ETAccordionDetails from "../../shared/accordion/components/AccordionDetails";
import EventGrid from "./EventGrid";
import { WorkplanContext } from "../WorkPlanContext";
import BorderLinearProgress from "../../shared/progress/Progress";
import Icons from "../../icons/index";
import { makeStyles } from "@mui/styles";
import { IconProps } from "../../icons/type";

const ExpandIcon: React.FC<IconProps> = Icons["ExpandIcon"];
const useStyles = makeStyles({
  summaryBox: {
    display: "flex",
    gap: "0.5rem",
    flexDirection: "column",
    minHeight: "48px",
  },
  title: {
    textTransform: "uppercase",
    color: `${Palette.neutral.main}`,
    letterSpacing: "0.39px !important",
  },
  content: {
    minHeight: "1.5rem",
    color: `${Palette.neutral.dark}`,
  },
  accordionIcon: {
    fill: Palette.primary.main,
    cursor: "pointer",
  },
});

interface SummaryItemProps {
  isTitleBold?: boolean;
  title: string;
  content?: string;
  children?: React.ReactNode;
  sx?: SxProps;
}
const SummaryItem = (props: SummaryItemProps) => {
  const clasess = useStyles();
  return (
    <Box
      className={clasess.summaryBox}
      sx={{
        ...props.sx,
      }}
    >
      <ETCaption1 className={clasess.title}>{props.title}</ETCaption1>
      {props.children && props.children}
      {props.content && (
        <ETParagraph
          className={clasess.content}
          bold={props.isTitleBold}
          sx={{ color: `${Palette.neutral.dark}` }}
        >
          {props.content}
        </ETParagraph>
      )}
    </Box>
  );
};

const PhaseAccordion = ({ phase, ...rest }: PhaseAccordionProps) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const ctx = useContext(WorkplanContext);
  const classes = useStyles();
  const isSelectedPhase = React.useMemo<boolean>(
    () => phase.phase_id === ctx.selectedPhase?.phase_id,
    [ctx.selectedPhase]
  );
  React.useEffect(
    () => setExpanded(phase.phase_id === ctx.selectedPhase?.phase_id),
    [phase, ctx.selectedPhase]
  );
  const onExpandHandler = (expand: boolean) => {
    setExpanded(expand);
    ctx.setSelectedPhase(phase);
  };
  const fromDate = React.useMemo(
    () =>
      Moment(phase.start_date).isSameOrAfter(Moment())
        ? Moment(phase.start_date)
        : Moment(),
    [phase]
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          mb: "16px",
        }}
      >
        <ETAccordion
          expanded={expanded}
          onChange={(e, expanded) => onExpandHandler(expanded)}
        >
          <ETAccordionSummary
            expanded={expanded}
            expandIcon={<ExpandIcon className={classes.accordionIcon} />}
          >
            <Grid
              container
              columnSpacing={3}
              sx={{
                pt: "1rem",
                pb: "1rem",
              }}
            >
              <Grid item xs={3}>
                <SummaryItem
                  title="Phase"
                  content={phase.phase}
                  isTitleBold={isSelectedPhase}
                  sx={{
                    ml: "12px",
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <SummaryItem
                  title="Start date"
                  content={Moment(phase.start_date).format("MMM.DD YYYY")}
                  isTitleBold={isSelectedPhase}
                />
              </Grid>
              <Grid item xs={1}>
                <SummaryItem
                  title="Days left"
                  content={Moment.duration(
                    Moment(phase.end_date).diff(fromDate)
                  )
                    .asDays()
                    .toFixed(0)}
                  isTitleBold={isSelectedPhase}
                />
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={2}>
                <SummaryItem
                  title="Next milestone"
                  content={phase.next_milestone}
                  isTitleBold={isSelectedPhase}
                />
              </Grid>
              <Grid item xs={2}>
                <SummaryItem title="Milestone progress">
                  <BorderLinearProgress
                    variant="determinate"
                    value={50}
                    sx={{ marginTop: "10px" }}
                  />
                </SummaryItem>
              </Grid>
            </Grid>
          </ETAccordionSummary>
          <ETAccordionDetails
            expanded={expanded}
            sx={{
              pt: "24px",
            }}
          >
            <EventGrid />
          </ETAccordionDetails>
        </ETAccordion>
      </Box>
    </>
  );
};

export default PhaseAccordion;
