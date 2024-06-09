import dayjs from 'dayjs';

export const getPrev7Day = () => {
  let now = dayjs();
  const res = [];
  for (let i = 0; i < 7; i++) {
    const date = now.format('MM.DD');
    now = now.add(-1, 'day');
    res.push(date);
  }
  return res;
}