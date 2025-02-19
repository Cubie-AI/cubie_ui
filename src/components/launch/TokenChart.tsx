import {
  AreaSeries,
  ColorType,
  createChart,
  UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

interface PriceData {
  price: number;
  time: number;
}

interface TokenChartProps {
  data: PriceData[];
}

function filterOutliers(someArray: PriceData[]) {
  // Copy the values, rather than operating on references to existing values
  var values = someArray.concat();

  // Then sort
  values.sort(function (a, b) {
    return a.price - b.price;
  });

  /* Then find a generous IQR. This is generous because if (values.length / 4)
   * is not an int, then really you should average the two elements on either
   * side to find q1.
   */
  var midPoint = values[Math.floor(values.length / 2)];
  // Then find min and max values
  var maxValue = midPoint.price * 3;
  var minValue = midPoint.price / 3;

  console.log(midPoint, maxValue, minValue);
  // Then filter anything beyond or beneath these values.
  var filteredValues = values.filter(function (x) {
    return x.price <= maxValue && x.price >= minValue;
  });

  console.log(filteredValues);
  // Then return
  const result = filteredValues.map((x) => ({
    time: x.time as UTCTimestamp,
    value: x.price,
  }));
  result.sort((a, b) => a.time - b.time);
  return result;
}
export function TokenChart({ data }: TokenChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#999",
      },
      grid: {
        vertLines: { color: "rgba(42, 46, 57, 0.1)" },
        horzLines: { color: "rgba(42, 46, 57, 0.1)" },
      },
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: "#00ff9d",
      topColor: "#00ff9d20",
      bottomColor: "transparent",
      lineWidth: 2,
      priceFormat: {
        precision: 2,
      },
    });

    const formattedData = filterOutliers(data);

    console.log(
      "First",
      new Date(formattedData[0].time * 1000),
      formattedData[0].value
    );
    console.log(
      "Last",
      new Date(formattedData[formattedData.length - 1].time * 1000),
      formattedData[formattedData.length - 1].value
    );
    areaSeries.setData(formattedData);

    areaSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    });
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
}
