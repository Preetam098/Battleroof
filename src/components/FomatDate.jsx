import moment from "moment";

const DateFigure = ({ time, format = " Do MMMM YYYY, h:mm:ss a" }) => {
  return <> {moment(time).format(format)}</>;
};

export default DateFigure;
