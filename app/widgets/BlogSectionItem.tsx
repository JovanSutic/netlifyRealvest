import { BlogSectionType } from "../types/blog.types";

const renderText = (text: string) => {
  // Regex for links: [Link Text](http://example.com)
  const linkRegex = /\[(.+?)\]\((https?:\/\/[^\s]+)\)/g;
  // Regex for bold text: **Bold Text**
  const boldRegex = /\*\*(.+?)\*\*/g;
  // Regex for unordered lists: *- List Item Text
  const listRegex = /^\*- (.*)/gm;

  // Replace in defined order to avoid conflicts (lists before links/bold)
  const withLists = text.replace(listRegex, (match, listItemText) => {
    return `<li>${listItemText}</li>`;
  });

  const withLinks = withLists.replace(linkRegex, (match, linkText, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
  });

  const withBold = withLinks.replace(boldRegex, (match, boldText) => {
    return `<strong>${boldText}</strong>`;
  });
  
  const parts = withBold.split(
    // eslint-disable-next-line no-useless-escape
    /(<a.*?<\/a>|<strong>.*?<\/strong>|<\li>.*?<\/li>)/g
  );

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
        <strong key={index} className="font-semibold text-gray-800">
          {part.replace(/<\/?strong>/g, "")}
        </strong>
      );
    } else if (part.startsWith("<li")) {
      return (
        <li key={index} className="text-md font-light md:text-md text-gray-700">
          {part.replace(/<\/?li>/g, "")}
        </li>
      );
    } else {
      return part; // Regular text
    }
  });
};

const BlogSectionItem = ({
  content,
  type,
  extra,
}: {
  content: string;
  type: BlogSectionType;
  extra: string;
}) => {
  return (
    <div className="w-full">
      {type === "title" && (
        <h3 className="font-bold text-black text-xl md:text-2xl mb-4">
          {content}
        </h3>
      )}
      {type === "sub" && (
        <h4 className="font-bold text-lg md:text-xl mb-4 mt-6 md:mt-8">
          {content}
        </h4>
      )}
      {type === "article" && (
        <p className="text-md font-light md:text-md text-gray-700 mb-4">
          {renderText(content)}
        </p>
      )}
      {type === "media" && (
        <div className="w-full md:w-[500px] lg:w-[700px] text-center mx-auto mb-4 md:mb-6">
          <img
            src={content}
            alt="some text"
            loading="lazy"
            className="max-w-full center"
          />
        </div>
      )}
      {type === "list" && (
        <ul className="w-full ml-8 mb-4 md:mb-6 list-disc">
          {renderText(content)}
        </ul>
      )}
      {type === "link" && (
        <div className="w-full mb-4 md:mb-6">
          <a
            href={content}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Link"
          >
            <div className="p-3 border-[1px] border-blue-500 rounded-md">
              <p className="w-full text-lg font-bold text-left text-blue-500">
                {extra}
              </p>
            </div>
          </a>
        </div>
      )}
    </div>
  );
};

export default BlogSectionItem;
