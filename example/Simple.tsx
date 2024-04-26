import { useEffect } from 'react';

import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

import EChartsReact, {
  useChart,
} from '../src';

echarts.use([GridComponent, LineChart, CanvasRenderer]);

const style = {
  width: '100%',
  height: 300,
};

const Simple = () => {
  const { chartRef, setChartOption, handleListenChartReady } = useChart();

  useEffect(() => {
    setChartOption({
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

  return (
    <EChartsReact
      style={style}
      ref={chartRef}
      echarts={echarts}
      onChartReady={handleListenChartReady}
    />
  );
};

export default Simple;