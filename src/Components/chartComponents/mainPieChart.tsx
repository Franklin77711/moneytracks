import { Chart } from "react-google-charts";
import PropTypes from 'prop-types';

function DrawChart({ chartData }: { chartData: Array<[string, number]> }){
    return(
        <>
            <Chart
                width={"100%"}
                height={"300px"}
                chartType="PieChart"
                legendToggle
                data={chartData}
                options={
                  {
                    legend: 'none',
                    format: 'decimal',
                    colors: ['#6f34ff'],
                    lineWidth: 4,
                    backgroundColor: 'transparent',
                    pieHole: 0.45,
                    is3D: false,
                  }
                }
            />
        </>
    )
}

DrawChart.propTypes = {
    chartData: PropTypes.object.isRequired,
  };

export default DrawChart