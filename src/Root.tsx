import "./index.css";
import { Composition } from "remotion";
import { VlogIntro } from "./animations/vlog-intro/VlogIntro";
import { LowerThird } from "./animations/lower-third/LowerThird";
import { Transition } from "./animations/transition/Transition";
import { Outro } from "./animations/outro/Outro";
import { PFIntro, PFOutro } from "./animations/programming-fundamentals";
import { TypingSystemsDiagram, LanguageComparisonChart, AIDosDonts, HelloWorldComparison } from "./tutorials/programming-fundamentals/components";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VlogIntro"
        component={VlogIntro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="LowerThird"
        component={LowerThird}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          name: "Endy Muhardin",
          title: "Software Consultant",
        }}
      />

      <Composition
        id="Transition"
        component={Transition}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Outro"
        component={Outro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Programming Fundamentals Series */}
      <Composition
        id="PFIntro"
        component={PFIntro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="PFOutro"
        component={PFOutro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          nextEpisodeTitle: "Setup GitHub & Codespaces",
        }}
      />

      {/* Episode 1 Assets */}
      <Composition
        id="TypingSystemsDiagram"
        component={TypingSystemsDiagram}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          showLanguages: ['Python', 'JavaScript', 'Java'],
          animateIn: true,
        }}
      />

      <Composition
        id="TypingSystemsDiagramAll"
        component={TypingSystemsDiagram}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          showLanguages: ['Python', 'JavaScript', 'Java', 'TypeScript', 'PHP', 'Go', 'Rust', 'C'],
          animateIn: true,
        }}
      />

      <Composition
        id="LanguageComparisonChart"
        component={LanguageComparisonChart}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Most Popular Programming Languages 2024",
          showTop: 10,
          highlightLanguages: ['Python', 'JavaScript', 'Java'],
        }}
      />

      {/* Episode 3 Assets */}
      <Composition
        id="AIDosDonts"
        component={AIDosDonts}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          showDos: true,
          showDonts: true,
        }}
      />

      {/* Episode 4 Assets */}
      <Composition
        id="HelloWorldComparison"
        component={HelloWorldComparison}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
