// Mock AI job description generator
// In production, replace with Claude API / OpenAI

const generateJobDescription = ({ title, category, jobType, workMode, salary, vacancies, location }) => {
  const modeText = workMode === 'remote' ? 'work from home' : 'work at our location';
  const typeText = jobType === 'full-time' ? 'full-time' : 'part-time';
  const salaryText = `₹${salary.amount} per ${salary.period}`;

  const description = `We are looking for a skilled ${title} to join our team in the ${category} sector.

This is a ${typeText} opportunity with ${modeText}. We have ${vacancies} opening(s) available.

Compensation: ${salaryText}
${location?.address ? `Location: ${location.address}` : ''}

Responsibilities:
- Perform tasks related to ${category}
- Maintain quality and meet deadlines
- Coordinate with the team and report progress

Requirements:
- Prior experience in ${category} preferred
- Reliable and punctual
- Good communication skills

Interested candidates can apply directly through the platform.`;

  return description.trim();
};

module.exports = { generateJobDescription };
