import { BlogSectionType } from "../types/blog.types";

const renderText = (text: string) => {
  // Regex for links: [Link Text](http://example.com)
  const linkRegex = /\[(.+?)\]\((https?:\/\/[^\s]+)\)/g;
  // Regex for bold text: **Bold Text**
  const boldRegex = /\*\*(.+?)\*\*/g;

  // First, replace links with a placeholder
  const withLinks = text.replace(linkRegex, (match, linkText, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
  });

  // Then, replace bold text with a placeholder
  const withBold = withLinks.replace(boldRegex, (match, boldText) => {
    return `<strong>${boldText}</strong>`;
  });

  // Finally, convert the string with placeholders to JSX
  const parts = withBold.split(/(<a.*?<\/a>|<strong>.*?<\/strong>)/g);

  return parts.map((part, index) => {
    if (part.startsWith("<a")) {
      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{ __html: part }}
          className="text-blue-500 hover:underline"
        />
      );
    } else if (part.startsWith("<strong>")) {
      return (
        <strong key={index} className="font-bold text-gray-800">
          {part.replace(/<\/?strong>/g, "")}
        </strong>
      );
    } else {
      return part; // Regular text
    }
  });
};

const BlogSectionItem = ({
  content,
  type,
}: {
  content: string;
  type: BlogSectionType;
}) => {
  return (
    <div className="w-full">
      {type === "title" && (
        <h3 className="font-bold text-black text-xl md:text-2xl mb-4">
          {content}
        </h3>
      )}
      {type === "sub" && (
        <h4 className="font-semibold text-lg md:text-xl mb-2">{content}</h4>
      )}
      {type === "article" && (
        <p className="text-sm md:text-md text-gray-700 mb-4">
          {renderText(content)}
        </p>
      )}
      {type === "media" && (
        <div className="w-full md:w-[500px] lg:w-[700px] text-center mx-auto mb-4">
          <img src={content} alt="some text" className="max-w-full center" />
        </div>
      )}
    </div>
  );
};

export default BlogSectionItem;
