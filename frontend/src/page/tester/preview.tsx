import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "react-query";
import { apiMe, apiSelectMark } from "../../api/axios";
import { ISelectMarkOutput } from "../../api/type";
import { PageLoading } from "../../component/page-loading";

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes…
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },
});

export const Preview = () => {
  const { isLoading: meIsLoading, data: meData } = useQuery("me", apiMe);
  const [memo, setMemo] = useState<string>("");
  const { isLoading: markIsLoading } = useQuery<ISelectMarkOutput>(
    ["selectMark", "testerId:" + meData.id],
    () => apiSelectMark(),
    {
      onSuccess: (data) => {
        if (data.ok && data.mark.mark) {
          editor?.commands.setContent(data?.mark?.mark);
        }
        if (data.mark.memo && !memo) {
          setMemo(data.mark.memo);
        }
      },
    }
  );

  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none   ",
      },
    },
  });

  if (meIsLoading && markIsLoading) {
    return <PageLoading text={"Loading"} />;
  }

  return (
    <div className="mt-10 flex flex-col justify-center items-center">
      <Helmet>
        <title>발표자료</title>
      </Helmet>
      <div className=" max-w-7xl mx-auto flex justify-center items-center min-w-min">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-start-1 col-end-10 row-start-1 ">
            <div className="w-full max-w-4xl font-sans text-2xl font-bold">
              발표자료
            </div>
            <div className="w-full bg-gray-600 my-1 h-0.5"></div>
            <div
              style={{ maxHeight: "80vh" }}
              className=" w-full max-w-4xl max-h-screen overflow-auto"
            >
              <EditorContent className="min-w-min" editor={editor} />
            </div>
          </div>
          <div className="col-start-10 col-end-13 row-start-1">
            <div className="w-full max-w-3xl font-sans text-2xl font-bold">
              메모장
            </div>
            <div className="w-full bg-gray-600 my-1 h-0.5"></div>
            <textarea
              readOnly
              rows={10}
              className=" w-60 p-2  border-2 border-gray-800 rounded-lg"
              defaultValue={memo !== null ? memo : ""}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};
