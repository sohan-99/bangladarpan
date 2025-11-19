// Convert English numbers to Bengali
const toBengaliNumber = (num: number): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num)
    .split('')
    .map((digit) => bengaliDigits[parseInt(digit)] || digit)
    .join('');
};

// Format date as relative time in Bengali
export const formatBengaliRelativeTime = (dateString: string): string => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInMs = now.getTime() - postDate.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return `${toBengaliNumber(diffInSeconds)} সেকেন্ড আগে`;
  } else if (diffInMinutes < 60) {
    return `${toBengaliNumber(diffInMinutes)} মিনিট আগে`;
  } else if (diffInHours < 24) {
    return `${toBengaliNumber(diffInHours)} ঘণ্টা আগে`;
  } else if (diffInDays < 30) {
    return `${toBengaliNumber(diffInDays)} দিন আগে`;
  } else if (diffInMonths < 12) {
    return `${toBengaliNumber(diffInMonths)} মাস আগে`;
  } else {
    return `${toBengaliNumber(diffInYears)} বছর আগে`;
  }
};
