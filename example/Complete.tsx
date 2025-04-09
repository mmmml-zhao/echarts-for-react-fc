import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';

// In your own project, bring it in from within 'echarts-for-react-fc' instead of '.../src'.
import EChartsReact, { useChart, useTooltip, CreateTooltipFn } from '../src';

echarts.use([
  GridComponent,
  TooltipComponent,
  LineChart,
  CanvasRenderer,
  SVGRenderer,
  UniversalTransition,
]);

const style = {
  width: '100%',
  height: 300,
};

const createTooltipFn: CreateTooltipFn = ({ params }) => {
  if (Array.isArray(params)) {
    return (
      <div>
        {params.map((item) => (
          <div>{item.name}</div>
        ))}
      </div>
    );
  } else {
    return <div>{params.name}</div>;
  }
};

const Complete: FC = () => {
  const { chartRef, setChartOption, handleListenChartReady } = useChart();

  const { tooltipDom, tooltipRender, createTooltip } = useTooltip({
    component: createTooltipFn,
  });

  const [renderer, setRenderer] = useState<'canvas' | 'svg'>('canvas');

  useEffect(() => {
    setChartOption({
      tooltip: {
        formatter: (params) => {
          createTooltip({ params });
          return tooltipDom;
        },
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          id: 1,
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    });

    setTimeout(() => {
      setChartOption({
        series: [
          {
            id: 2,
            data: [400, 130, 224, 118, 35, 47, 260],
            type: 'line',
          },
        ],
      });
    }, 2000);
  }, []);

  const handleClickToggleRenderer = useCallback(() => {
    setRenderer((oldRenderer) => (oldRenderer === 'canvas' ? 'svg' : 'canvas'));
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
      {tooltipRender}
    </>
  );
};

export default Complete;
