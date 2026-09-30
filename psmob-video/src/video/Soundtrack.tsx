import React from "react";
import { Audio, staticFile } from "remotion";

// Locución final (58 s). Las escenas están cronometradas a sus frases (ver timing.ts).
export const Soundtrack: React.FC = () => <Audio src={staticFile("audio/locucion.mp3")} />;
