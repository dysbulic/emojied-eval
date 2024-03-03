import { useEffect, useMemo, useRef } from 'react'
import * as d3 from 'd3'
import { ReactedVideo } from '../Score'
import { timeToSeconds } from '../../lib/utils'
import { Point } from '../Reactor'
import { Maybe } from '../FeedbackBulkAddDialog'
import { Rubric } from '../WeightedReactions'

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 }

type Props = {
  width?: number
  height?: number
  video: ReactedVideo
  weights: Maybe<Record<string, number>>
  rubric: Maybe<Rubric>
}

export const WeightsChart = (
  ({ width = 800, height = 300, video, weights, rubric }: Props) => {
    const axesRef = useRef(null)
    const bounds = {
      width: width - MARGIN.right - MARGIN.left,
      height: height - MARGIN.top - MARGIN.bottom,
    }
    const data = video.reactions.map(
      ({ start_time, feedback_id }) => ({
        x: timeToSeconds(start_time),
        y: weights?.[feedback_id] ?? rubric?.default_weight ?? 0,
      })
    )
    const max = {
      x: Math.max(...data.map(({ x }) => x)),
      y: Math.max(...data.map(({ y }) => y)),
    }
    console.debug({ data, max, r: video.reactions, weights })
    const xScale = useMemo(() => (
      d3.scaleLinear().domain([0, max.x]).range([0, bounds.width])
    ), [bounds.width, max.x])
    const yScale = useMemo(() => (
      d3.scaleLinear().domain([0, max.y]).range([bounds.height, 0])
    ), [bounds.height, max.y])

    useEffect(() => {
      const svgElement = d3.select(axesRef.current)
      svgElement.selectAll('*').remove()

      const xAxisGenerator = d3.axisBottom(xScale)

      svgElement
      .append('g')
      .attr('transform', `translate(0,${bounds.height})`)
      .call(xAxisGenerator)

      const yAxisGenerator = d3.axisLeft(yScale)
      svgElement.append('g').call(yAxisGenerator)
    }, [xScale, yScale, bounds.height])

    const lineBuilder = (
      d3
      .line<Point>()
      .x(({ x }) => xScale(x))
      .y(({ y }) => yScale(y))
    )
    const linePath = lineBuilder(data)

    if(!linePath) {
      return null
    }

    return (
      <div>
        <svg viewBox={`0 0 ${width} ${height}`}>
          <g
            width={bounds.width}
            height={bounds.height}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
          >
            <path
              d={linePath}
              stroke="#69b3a2"
              fill="none"
            />
          </g>
          <g
            width={bounds.width}
            height={bounds.height}
            ref={axesRef}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
          />
        </svg>
      </div>
    )
  }
)

export default WeightsChart