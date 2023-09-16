import { useCallback, useEffect, useMemo, useState } from "react";
import * as echarts from "echarts/core";
import EChartsReact, { useChart } from "../src";

import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";

echarts.use([
  GridComponent,
  LineChart,
  CanvasRenderer,
  SVGRenderer,
  UniversalTransition,
]);

const style = {
  width: "100%",
  height: 300,
};
function App() {
  const { chartRef, setChartOption, handleListenChartReady } = useChart();

  const [renderer, setRenderer] = useState<"canvas" | "svg">("canvas");

  useEffect(() => {
    setChartOption({
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: "line",
        },
      ],
    });
  }, []);

  const handleClickToggleRenderer = useCallback(() => {
    setRenderer((oldRenderer) => (oldRenderer === "canvas" ? "svg" : "canvas"));
  }, []);

  const initOpts = useMemo(() => {
    return {
      renderer: renderer,
    };
  }, [renderer]);

  return (
    <>
      <p> now renderer: {renderer}</p>
      <button onClick={handleClickToggleRenderer}>toggle theme</button>
      <EChartsReact
        ref={chartRef}
        initOpts={initOpts}
        style={style}
        echarts={echarts}
        onChartReady={handleListenChartReady}
      ></EChartsReact>
    </>
  );
}

export default App;
