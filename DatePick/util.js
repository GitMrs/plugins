const formatDate = (date) => {
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getDate();
  return {year,month,day}
}
const getDate = (year,month,day) => {
  return new Date(year,month,day)
}
export {
  formatDate,
  getDate
}