import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { LangType } from "../types/dashboard.types";
import { isMobile } from "../utils/params";
import { useEffect, useState } from "react";
import Select from "../components/select/Select";
import Modal from "../components/modal";
import { blogSchema } from "../data/schema/validators";
import {
  BlogContent,
  BlogSection,
  BlogSectionType,
  Blog,
} from "../types/blog.types";
import { createSlug, getRandomString } from "../utils/text";
import Alert from "../components/alert";
import BlogSectionItem from "../widgets/BlogSectionItem";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (process.env.BASE_URL !== "http://localhost:5173") {
    throw Error("Forbidden");
    return null;
  }
  const userAgent = request.headers.get("user-agent");

  return {
    mobile: isMobile(userAgent!),
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const source = String(formData.get("source"));
  const { supabaseClient, headers } = createSupabaseServerClient(request);

  const url = new URL(request.url);
  const blog_id = url.searchParams.get("blog_id");

  if (source === "blog") {
    const name = String(formData.get("name"));
    const language = String(formData.get("language"));
    const description = String(formData.get("description"));
    const link = String(formData.get("link"));
    const { success, error: zError } = blogSchema.safeParse({
      language,
      name,
      description,
      link,
    });

    if (zError) {
      return json({ success: false, error: zError }, { headers, status: 400 });
    }

    if (success) {
      try {
        const today = new Date();
        const { data: blogData, error: blogError } = await supabaseClient
          .from("blogs")
          .insert({
            language,
            name,
            description,
            slug: createSlug(name),
            date_created: today,
            media_link: link,
          })
          .select();

        if (blogError) {
          throw json({ error: blogError?.message }, { status: 400 });
        } else {
          return json(
            { success: true, data: blogData, type: "blog" },
            { headers, status: 200 }
          );
        }
      } catch (error) {
        return json({ success: false, error: error }, { headers, status: 400 });
      }
    }
  }

  if (source === "section") {
    const types: BlogSectionType[] = [];
    const contents: string[] = [];
    const extras: string[] = [];

    for (const [key, value] of formData.entries()) {
      if (key.substring(0, 4) === "type") {
        types.push(value as BlogSectionType);
      }
      if (key.substring(0, 4) === "cont") {
        contents.push(value as string);
      }
      if (key.substring(0, 4) === "extr") {
        extras.push((value || '') as string);
      }
    }

    if (
      types.length &&
      contents.length &&
      Number(blog_id) > 0 &&
      types.length === contents.length
    ) {
      try {
        const { data: blogData, error: blogError } = await supabaseClient
          .from("blogs")
          .select("*")
          .eq("id", Number(blog_id));

        if (blogError) {
          return json(
            { success: false, error: blogError },
            { headers, status: 400 }
          );
        }
        if (!blogData || !blogData.length) {
          return json(
            { success: false, error: "blogNotFound" },
            { headers, status: 400 }
          );
        }

        const { data: currentData, error: currentError } = await supabaseClient
          .from("blogs_content")
          .select("*")
          .eq("blog_id", Number(blog_id));
        if (currentError) {
          return json(
            { success: false, error: currentError },
            { headers, status: 400 }
          );
        }
        if (currentData.length) {
          return json(
            { success: false, error: "blogContentExist" },
            { headers, status: 400 }
          );
        }

        const blogContent: BlogContent[] = [];
        types.forEach((item: BlogSectionType, index) =>
          blogContent.push({
            type: item,
            sequence: index + 1,
            content: contents[index],
            extra: extras[index],
            blog_id: Number(blog_id),
          })
        );
        const { error: sectionError } = await supabaseClient
          .from("blogs_content")
          .insert(blogContent);

        if (sectionError) {
          return json(
            { success: false, error: sectionError },
            { headers, status: 400 }
          );
        } else {
          return json(
            { success: true, type: "section" },
            { headers, status: 200 }
          );
        }
      } catch (error) {
        return json({ success: false, error: error }, { headers, status: 400 });
      }
    } else {
      return json(
        { success: false, error: "contentStructure" },
        { headers, status: 400 }
      );
    }
  }

  return null;
};

export default function NewBlog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = (searchParams.get("lang") as LangType) || "sr";
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [language, setLanguage] = useState<LangType>(lang || "sr");
  const [sections, setSections] = useState<BlogSection[]>([]);
  const [sectionError, setSectionError] = useState<string>("");

  const actionData = useActionData<{
    success: boolean;
    error?: string;
    type: string;
    data: Blog[];
  }>();

  useEffect(() => {
    if (actionData?.success && actionData.type === "blog") {
      setName("");
      setDescription("");
      setLink("");
      setLanguage(lang);
      setIsOpen(false);
      setSearchParams((prev) => {
        prev.set("blog_id", String(actionData.data[0].id));
        prev.set("blog_name", String(actionData.data[0].name));
        prev.set("blog_lang", String(actionData.data[0].language));
        return prev;
      });
    }

    if (actionData?.success && actionData.type === "section") {
      setSections([]);
    }

    if (!actionData?.success) {
      setSectionError(actionData?.error || "");
    }
  }, [actionData]);

  return (
    <div className="p-2">
      <div className="grid grid-cols-4">
        <div className="col-span-1 flex flex-col gap-2 border-r-[1px] border-gray-300 p-2">
          <Alert
            type="error"
            isOpen={sectionError?.length > 0}
            title={"error"}
            text={sectionError}
            close={() => setSectionError("")}
          />
          <div className="w-full flex flex-col items-center mb-4">
            <h2 className="text-lg text-center text-bold mb-3">
              Your place for creating new blogs
            </h2>
            <div className="w-[160px]">
              <button
                onClick={() => setIsOpen(true)}
                disabled={searchParams.get("blog_id") !== null}
                className="w-full py-2 text-center text-sm font-semibold text-white bg-blue-500 rounded-xl  transition-all duration-300 transform hover:bg-blue-700 focus:ring-2 focus:outline-none disabled:bg-slate-300 disabled:cursor-no-drop focus:ring-opacity-50"
              >
                CREATE NEW
              </button>
            </div>
          </div>

          <div>
            {searchParams.get("blog_id") && (
              <div className="w-full flex flex-col items-center mb-4">
                <h3 className="font-bold text-md text-center mb-1">{`Create sections for the blog with id: ${searchParams.get(
                  "blog_id"
                )}`}</h3>
                <p className="text-sm text-center mb-1">{`Blog name: ${searchParams.get(
                  "blog_name"
                )}`}</p>
                <p className="text-sm text-center mb-1">{`Blog language: ${searchParams.get(
                  "blog_lang"
                )}`}</p>
                <div className="w-[160px]">
                  <button
                    onClick={() => {
                      searchParams.delete("blog_id");
                      searchParams.delete("blog_name");
                      searchParams.delete("blog_lang");
                      setSearchParams(searchParams);
                      setSections([]);
                    }}
                    className="w-full py-2 text-center text-sm font-semibold text-white bg-blue-500 rounded-xl  transition-all duration-300 transform hover:bg-blue-700 focus:ring-2 focus:outline-none disabled:bg-slate-300 disabled:cursor-no-drop focus:ring-opacity-50"
                  >
                    CLEAR BLOG
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-3 ">
          {searchParams.get("blog_id") && (
            <div className="w-full flex flex-col items-center px-4">
              {searchParams.get("preview") === "true" ? (
                <div className="w-full">
                  <button
                    onClick={() => {
                      searchParams.delete("preview");
                      setSearchParams(searchParams);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {sections.map((item) => (
                    <BlogSectionItem
                      key={item.id}
                      content={item.content}
                      extra={item.extra || ''}
                      type={item.type}
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="w-full">
                    <Form method="post" className="mt-4 w-full">
                      <input name="source" type="hidden" value="section" />
                      {sections.map((item, index) => (
                        <div key={item.id}>
                          <div>
                            <button
                              onClick={() => {
                                const newSections: BlogSection[] = [];
                                sections.forEach((item, subIndex) => {
                                  if (index !== subIndex) {
                                    newSections.push(item);
                                  }
                                });

                                setSections(newSections);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-6"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="mb-2">
                            <Select
                              name={`type${index}`}
                              value={item.type}
                              isFullWidth={true}
                              setValue={(value) => {
                                const newSections: BlogSection[] = [];
                                sections.forEach((item, subIndex) => {
                                  if (index === subIndex) {
                                    item.type = value as BlogSectionType;
                                    newSections.push(item);
                                  } else {
                                    newSections.push(item);
                                  }
                                });
                                setSections(newSections);
                              }}
                              options={[
                                { text: "Title", value: "title" },
                                { text: "Subtitle", value: "sub" },
                                { text: "Article", value: "article" },
                                { text: "MediaLink", value: "media" },
                                { text: "List", value: "list" },
                                { text: "AnchorLink", value: "link" },
                              ]}
                            />
                          </div>
                          {item.type === "link" && (
                            <input
                              type="text"
                              name={`extra${index}`}
                              value={item.extra}
                              placeholder="Only for link"
                              onChange={(event) => {
                                const newSections: BlogSection[] = [];
                                sections.forEach((item, subIndex) => {
                                  if (index === subIndex) {
                                    item.extra = event.target.value;
                                    newSections.push(item);
                                  } else {
                                    newSections.push(item);
                                  }
                                });
                                setSections(newSections);
                              }}
                              className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                            />
                          )}

                          <textarea
                            name={`content${index}`}
                            rows={4}
                            required
                            className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                            placeholder="Meta description"
                            value={item.content}
                            onChange={(event) => {
                              const newSections: BlogSection[] = [];
                              sections.forEach((item, subIndex) => {
                                if (index === subIndex) {
                                  item.content = event.target.value;
                                  newSections.push(item);
                                } else {
                                  newSections.push(item);
                                }
                              });
                              setSections(newSections);
                            }}
                          />
                        </div>
                      ))}
                      <div className="flex flex-row justify-center gap-4 mt-6 mb-6">
                        <button
                          onClick={() => {
                            setSections([
                              ...sections,
                              {
                                id: getRandomString(8),
                                type: "title",
                                content: "",
                              },
                            ]);
                          }}
                          className="px-6 py-2 font-semibold text-center text-sm text-white bg-blue-500 rounded-lg  transition-all duration-300 transform hover:bg-blue-700 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                        >
                          {!sections.length
                            ? "CREATE CONTENT SECTION"
                            : "ADD CONTENT SECTION"}
                        </button>
                        {sections.length > 0 && (
                          <button
                            onClick={() => {
                              setSearchParams((prev) => {
                                prev.set("preview", "true");
                                return prev;
                              });
                            }}
                            type="button"
                            className="text-md px-6 py-2 bg-gray-500 font-semibold text-white rounded-lg transition-all duration-300 transform hover:bg-gray-700 focus:outline-none "
                          >
                            Preview
                          </button>
                        )}
                        {sections.length > 0 && (
                          <button
                            className="text-md px-6 py-2 bg-green-500 font-semibold text-white rounded-lg transition-all duration-300 transform hover:bg-green-700 focus:outline-none "
                            type="submit"
                          >
                            Create
                          </button>
                        )}
                      </div>
                    </Form>
                  </div>
                  <div className="w-[260px]"></div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal open={isOpen}>
        <>
          <h3 className="text-center text-2xl font-bold mb-2">New Blog</h3>
          <hr />
          <Form method="post" className="mt-4">
            <input name="source" type="hidden" value="blog" />
            <input
              name="name"
              type="text"
              required
              className="w-full text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none mb-2"
              placeholder="Blog name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <div className="mb-2">
              <Select
                name="language"
                value={language}
                isFullWidth={true}
                setValue={(value) => {
                  setLanguage(value as LangType);
                }}
                options={[
                  { text: "English", value: "en" },
                  { text: "Srpski", value: "sr" },
                ]}
              />
            </div>

            <input
              name="link"
              type="text"
              required
              className="w-full text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none mb-2"
              placeholder="Media link"
              value={link}
              onChange={(event) => setLink(event.target.value)}
            />

            <textarea
              name="description"
              rows={4}
              required
              className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
              placeholder="Meta description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            <div className="flex flex-row-reverse gap-4 mt-6">
              <button
                onClick={() => {
                  setIsOpen(false);
                }}
                className="text-md px-6 py-2 bg-red-500 font-semibold text-white rounded-md transition-all duration-300 transform hover:bg-gray-700 focus:outline-none "
              >
                {"Close"}
              </button>
              <button
                className="text-md px-6 py-2 bg-green-500 font-semibold text-white rounded-md transition-all duration-300 transform hover:bg-gray-700 focus:outline-none "
                type="submit"
              >
                Create
              </button>
            </div>
          </Form>
        </>
      </Modal>
    </div>
  );
}
