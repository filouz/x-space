import { MarkdownState } from './slices/markdownSlice';
import { MapState } from './slices/mapSlice';
import { ChartState } from './slices/chartSlice';

export interface RootState {
  markdown: MarkdownState;
  map: MapState,
  chart: ChartState
}