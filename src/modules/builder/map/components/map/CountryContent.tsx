import { Dispatch } from "react";
import { useMap } from "react-leaflet";

import { Paper } from "@mui/material";

import i18n from "../../config/i18n";
import { Country } from "../../types/types";
import CountryForm from "../CountryForm/CountryForm";

const CountryContent = ({
  setShowMap,
}: {
  setShowMap: Dispatch<boolean>;
}): JSX.Element => {
  const map = useMap();
  const onChange = (newValue: Country) => {
    // necessary to move map
    setShowMap(true);
    map.fitBounds([newValue.minBoundary, newValue.maxBoundary]);
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw",
          background: "rgba(0,0,0,0.5)",
          zIndex: 450,
        }}
      />
      <Paper
        style={{
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "absolute",
          zIndex: 450,
          borderRadius: 15,
        }}
      >
        <CountryForm
          onChange={onChange}
          placement="bottom"
          lang={i18n.language}
        />
      </Paper>
    </div>
  );
};

export default CountryContent;
