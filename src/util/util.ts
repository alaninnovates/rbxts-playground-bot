export const generateCodeBlcok = (language: string, content: string) => {
	return `\`\`\`${language}\n${content}\`\`\``;
};
