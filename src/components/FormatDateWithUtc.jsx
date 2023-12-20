import moment from "moment";

const DateFigureWithUTC = ({ time }) => {
  return <> {moment.utc(time).format(" Do MMMM YYYY, h:mm:ss a")}</>;
};

export default DateFigureWithUTC;
