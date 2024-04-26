import EChartsReact from './Core';
import useChart from './hooks/useChart';
import useTooltip from './hooks/useTooltip';

export type {
  EChartsReactProps,
  ChartRef,
  EChartsEventInfo,
  EChartsInstance,
} from './types';

export { useChart, useTooltip };

export default EChartsReact;
