import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  apiEndTest,
  apiMe,
  apiSearchQuestion,
  apiSelectMark,
  apiUpdateMark,
} from "../../api/axios";
import { PageLoading } from "../../component/page-loading";
import {
  ICoreOutput,
  ISearchCoreOutput,
  ISelectMarkOutput,
  IUpdateMarkOutput,
} from "../../api/type";
import { Pagination } from "../../component/pagination";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faBold,
  faCalculator,
  faFill,
  faItalic,
  faMinus,
  faPlus,
  faRemoveFormat,
  faStickyNote,
  faStrikethrough,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import { useInterval } from "../../hook/useInterval";
import { useNavigate } from "react-router-dom";
import { Calculator } from "../../component/calculator";
import { LOCALSTORAGE_TOKEN } from "../../constant";
import { socket, startTestToServer } from "../../api/socket-io";
import Swal from "sweetalert2";

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

const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="text-sm pt-1 flex flex-wrap justify-start items-center border-2 border-b-0 border-gray-500 p-1">
      <button
        className="p-1 hover:bg-gray-200 mr-1"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>뒤로</title>
          <path d="M17.786,3.77A12.542,12.542,0,0,0,4.821,2.905a.249.249,0,0,1-.292-.045L1.937.269A.507.507,0,0,0,1.392.16a.5.5,0,0,0-.308.462v6.7a.5.5,0,0,0,.5.5h6.7a.5.5,0,0,0,.354-.854L6.783,5.115a.253.253,0,0,1-.068-.228.249.249,0,0,1,.152-.181,10,10,0,0,1,9.466,1.1,9.759,9.759,0,0,1,.094,15.809A1.25,1.25,0,0,0,17.9,23.631a12.122,12.122,0,0,0,5.013-9.961A12.125,12.125,0,0,0,17.786,3.77Z" />
        </svg>
      </button>
      <button
        className="p-1 hover:bg-gray-200 m-1"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>앞으로</title>
          <path
            xmlns="http://www.w3.org/2000/svg"
            d="M22.608.161a.5.5,0,0,0-.545.108L19.472,2.86a.25.25,0,0,1-.292.045A12.537,12.537,0,0,0,6.214,3.77,12.259,12.259,0,0,0,6.1,23.632a1.25,1.25,0,0,0,1.476-2.018A9.759,9.759,0,0,1,7.667,5.805a10,10,0,0,1,9.466-1.1.25.25,0,0,1,.084.409l-1.85,1.85a.5.5,0,0,0,.354.853h6.7a.5.5,0,0,0,.5-.5V.623A.5.5,0,0,0,22.608.161Z"
          />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? "p-1 bg-gray-200 m-1"
            : "p-1 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>bold</title>
          <FontAwesomeIcon icon={faBold} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? "p-1 bg-gray-200 m-1"
            : "p-1 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>italic</title>
          <FontAwesomeIcon icon={faItalic} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike")
            ? "p-1 bg-gray-200 m-1"
            : "p-1 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>strike</title>
          <FontAwesomeIcon icon={faStrikethrough} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={
          editor.isActive("underline")
            ? "p-1 bg-gray-200 m-1"
            : "p-1 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          viewBox="0 0 24 24"
        >
          <title>밑줄</title>
          <FontAwesomeIcon icon={faUnderline} />
        </svg>
      </button>
      <button
        className="p-1 hover:bg-gray-200 m-1"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>clear format</title>
          <FontAwesomeIcon icon={faRemoveFormat} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={
          editor.isActive("paragraph")
            ? "p-1 bg-gray-200 m-1 font-bold text-xl w-9"
            : "p-1 hover:bg-gray-200 m-1 font-bold text-xl w-9 "
        }
        title="기본"
      >
        T
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "p-1 bg-gray-200 m-1 font-bold text-xl"
            : "p-1 hover:bg-gray-200 m-1 font-bold text-xl"
        }
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "p-1 bg-gray-200 m-1 font-bold text-xl"
            : "p-1 hover:bg-gray-200 m-1 font-bold text-xl"
        }
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 3 })
            ? "p-1 bg-gray-200 m-1 font-bold text-xl"
            : "p-1 hover:bg-gray-200 m-1 font-bold text-xl"
        }
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={
          editor.isActive({ textAlign: "left" })
            ? "p-1 bg-gray-200 m-1"
            : "p-1 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>왼쪽 정렬</title>
          <FontAwesomeIcon icon={faAlignLeft} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={
          editor.isActive({ textAlign: "center" })
            ? "p-1 bg-gray-200 m-1"
            : "p-1 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>가운데 정렬</title>
          <FontAwesomeIcon icon={faAlignCenter} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={
          editor.isActive({ textAlign: "right" })
            ? "p-1 bg-gray-200 m-1"
            : "p-1 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>오른쪽 정렬</title>
          <FontAwesomeIcon icon={faAlignRight} />
        </svg>
      </button>
      <button
        className="p-1 hover:bg-gray-200 m-1"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title> horizontal rule</title>
          <path d="M5,13 C4.44771525,13 4,12.5522847 4,12 C4,11.4477153 4.44771525,11 5,11 L19,11 C19.5522847,11 20,11.4477153 20,12 C20,12.5522847 19.5522847,13 19,13 L5,13 Z" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? "p-1 bg-gray-200 m-1"
            : "p-1 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>list-bullets</title>
          <circle cx="2.5" cy="3.998" r="2.5" />
          <path d="M8.5,5H23a1,1,0,0,0,0-2H8.5a1,1,0,0,0,0,2Z" />
          <circle cx="2.5" cy="11.998" r="2.5" />
          <path d="M23,11H8.5a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z" />
          <circle cx="2.5" cy="19.998" r="2.5" />
          <path d="M23,19H8.5a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList")
            ? "p-1 bg-gray-200 m-1"
            : "p-1 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>list-numbers</title>
          <path d="M7.75,4.5h15a1,1,0,0,0,0-2h-15a1,1,0,0,0,0,2Z" />
          <path d="M22.75,11h-15a1,1,0,1,0,0,2h15a1,1,0,0,0,0-2Z" />
          <path d="M22.75,19.5h-15a1,1,0,0,0,0,2h15a1,1,0,0,0,0-2Z" />
          <path d="M2.212,17.248A2,2,0,0,0,.279,18.732a.75.75,0,1,0,1.45.386.5.5,0,1,1,.483.63.75.75,0,1,0,0,1.5.5.5,0,1,1-.482.635.75.75,0,1,0-1.445.4,2,2,0,1,0,3.589-1.648.251.251,0,0,1,0-.278,2,2,0,0,0-1.662-3.111Z" />
          <path d="M4.25,10.748a2,2,0,0,0-4,0,.75.75,0,0,0,1.5,0,.5.5,0,0,1,1,0,1.031,1.031,0,0,1-.227.645L.414,14.029A.75.75,0,0,0,1,15.248H3.5a.75.75,0,0,0,0-1.5H3.081a.249.249,0,0,1-.195-.406L3.7,12.33A2.544,2.544,0,0,0,4.25,10.748Z" />
          <path d="M4,5.248H3.75A.25.25,0,0,1,3.5,5V1.623A1.377,1.377,0,0,0,2.125.248H1.5a.75.75,0,0,0,0,1.5h.25A.25.25,0,0,1,2,2V5a.25.25,0,0,1-.25.25H1.5a.75.75,0,0,0,0,1.5H4a.75.75,0,0,0,0-1.5Z" />
        </svg>
      </button>
      <button
        className="p-1 hover:bg-gray-200 m-1"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M17,17 L17,22 L19,22 C20.6568542,22 22,20.6568542 22,19 L22,17 L17,17 Z M15,17 L9,17 L9,22 L15,22 L15,17 Z M17,15 L22,15 L22,9 L17,9 L17,15 Z M15,15 L15,9 L9,9 L9,15 L15,15 Z M17,7 L22,7 L22,5 C22,3.34314575 20.6568542,2 19,2 L17,2 L17,7 Z M15,7 L15,2 L9,2 L9,7 L15,7 Z M24,16.1768671 L24,19 C24,21.7614237 21.7614237,24 19,24 L5,24 C2.23857625,24 2.11453371e-15,21.7614237 1.77635684e-15,19 L0,5 C-3.38176876e-16,2.23857625 2.23857625,2.28362215e-15 5,0 L19,0 C21.7614237,-5.07265313e-16 24,2.23857625 24,5 L24,7.82313285 C24.0122947,7.88054124 24.0187107,7.93964623 24.0187107,8 C24.0187107,8.06035377 24.0122947,8.11945876 24,8.17686715 L24,15.8231329 C24.0122947,15.8805412 24.0187107,15.9396462 24.0187107,16 C24.0187107,16.0603538 24.0122947,16.1194588 24,16.1768671 Z M7,2 L5,2 C3.34314575,2 2,3.34314575 2,5 L2,7 L7,7 L7,2 Z M2,9 L2,15 L7,15 L7,9 L2,9 Z M2,17 L2,19 C2,20.6568542 3.34314575,22 5,22 L7,22 L7,17 L2,17 Z"
          />
        </svg>
      </button>
      <button
        className={`p-1  m-1 ${
          editor.can().addColumnBefore() ? `hover:bg-gray-200 ` : ` hidden `
        }`}
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        disabled={!editor.can().addColumnBefore()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L20.25,18.0625 C20.077411,18.0625 19.9375,17.922589 19.9375,17.75 L19.9375,16.5 C19.9375,15.982233 19.517767,15.5625 19,15.5625 C18.482233,15.5625 18.0625,15.982233 18.0625,16.5 L18.0625,17.75 C18.0625,17.922589 17.922589,18.0625 17.75,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 L17.75,19.9375 C17.922589,19.9375 18.0625,20.077411 18.0625,20.25 L18.0625,21.5 C18.0625,22.017767 18.482233,22.4375 19,22.4375 C19.517767,22.4375 19.9375,22.017767 19.9375,21.5 L19.9375,20.25 C19.9375,20.077411 20.077411,19.9375 20.25,19.9375 L21.5,19.9375 Z M2,19 C2,20.6568542 3.34314575,22 5,22 C6.65685425,22 8,20.6568542 8,19 L8,5 C8,3.34314575 6.65685425,2 5,2 C3.34314575,2 2,3.34314575 2,5 L2,19 Z M-2.7585502e-16,19 L5.81397739e-16,5 C-1.37692243e-16,2.23857625 2.23857625,0 5,0 C7.76142375,0 10,2.23857625 10,5 L10,19 C10,21.7614237 7.76142375,24 5,24 C2.23857625,24 4.43234962e-16,21.7614237 -2.7585502e-16,19 Z" />
        </svg>
      </button>
      <button
        className={`p-1  m-1 ${
          editor.can().addColumnAfter() ? `hover:bg-gray-200` : ` hidden `
        }`}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        disabled={!editor.can().addColumnAfter()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M5,14 C7.76005315,14.0033061 9.99669388,16.2399468 10,19 C10,21.7614237 7.76142375,24 5,24 C2.23857625,24 1.77635684e-15,21.7614237 1.77635684e-15,19 C1.77635684e-15,16.2385763 2.23857625,14 5,14 Z M7.5,19.9375 C8.01776695,19.9375 8.4375,19.517767 8.4375,19 C8.4375,18.482233 8.01776695,18.0625 7.5,18.0625 L6.25,18.0625 C6.07741102,18.0625 5.9375,17.922589 5.9375,17.75 L5.9375,16.5 C5.9375,15.982233 5.51776695,15.5625 5,15.5625 C4.48223305,15.5625 4.0625,15.982233 4.0625,16.5 L4.0625,17.75 C4.0625,17.922589 3.92258898,18.0625 3.75,18.0625 L2.5,18.0625 C1.98223305,18.0625 1.5625,18.482233 1.5625,19 C1.5625,19.517767 1.98223305,19.9375 2.5,19.9375 L3.75,19.9375 C3.92258898,19.9375 4.0625,20.077411 4.0625,20.25 L4.0625,21.5 C4.0625,22.017767 4.48223305,22.4375 5,22.4375 C5.51776695,22.4375 5.9375,22.017767 5.9375,21.5 L5.9375,20.25 C5.9375,20.077411 6.07741102,19.9375 6.25,19.9375 L7.5,19.9375 Z M16,19 C16,20.6568542 17.3431458,22 19,22 C20.6568542,22 22,20.6568542 22,19 L22,5 C22,3.34314575 20.6568542,2 19,2 C17.3431458,2 16,3.34314575 16,5 L16,19 Z M14,19 L14,5 C14,2.23857625 16.2385763,0 19,0 C21.7614237,0 24,2.23857625 24,5 L24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 Z" />
        </svg>
      </button>
      <button
        className={`p-1 m-1 ${
          editor.can().deleteColumn() ? `hover:bg-gray-200` : ` hidden `
        }`}
        onClick={() => editor.chain().focus().deleteColumn().run()}
        disabled={!editor.can().deleteColumn()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M12.6414391,21.9312708 C12.9358807,22.5689168 13.3234155,23.1547532 13.7866134,23.6713497 C13.2317936,23.8836754 12.6294813,24 12,24 C9.23857625,24 7,21.7614237 7,19 L7,5 C7,2.23857625 9.23857625,0 12,0 C14.7614237,0 17,2.23857625 17,5 L17,12.2898787 C16.2775651,12.5048858 15.6040072,12.8333806 15,13.2546893 L15,5 C15,3.34314575 13.6568542,2 12,2 C10.3431458,2 9,3.34314575 9,5 L9,19 C9,20.6568542 10.3431458,22 12,22 C12.220157,22 12.4347751,21.9762852 12.6414391,21.9312708 Z M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M16.5,19.9375 L21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 Z" />
        </svg>
      </button>
      <button
        className={`p-1   m-1 ${
          editor.can().addRowBefore() ? `hover:bg-gray-200 ` : ` hidden `
        }`}
        onClick={() => editor.chain().focus().addRowBefore().run()}
        disabled={!editor.can().addRowBefore()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L20.25,18.0625 C20.077411,18.0625 19.9375,17.922589 19.9375,17.75 L19.9375,16.5 C19.9375,15.982233 19.517767,15.5625 19,15.5625 C18.482233,15.5625 18.0625,15.982233 18.0625,16.5 L18.0625,17.75 C18.0625,17.922589 17.922589,18.0625 17.75,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 L17.75,19.9375 C17.922589,19.9375 18.0625,20.077411 18.0625,20.25 L18.0625,21.5 C18.0625,22.017767 18.482233,22.4375 19,22.4375 C19.517767,22.4375 19.9375,22.017767 19.9375,21.5 L19.9375,20.25 C19.9375,20.077411 20.077411,19.9375 20.25,19.9375 L21.5,19.9375 Z M5,2 C3.34314575,2 2,3.34314575 2,5 C2,6.65685425 3.34314575,8 5,8 L19,8 C20.6568542,8 22,6.65685425 22,5 C22,3.34314575 20.6568542,2 19,2 L5,2 Z M5,0 L19,0 C21.7614237,-5.07265313e-16 24,2.23857625 24,5 C24,7.76142375 21.7614237,10 19,10 L5,10 C2.23857625,10 3.38176876e-16,7.76142375 0,5 C-1.2263553e-15,2.23857625 2.23857625,5.07265313e-16 5,0 Z" />
        </svg>
      </button>
      <button
        className={`p-1   m-1 ${
          editor.can().addRowAfter() ? `hover:bg-gray-200 ` : ` hidden `
        }`}
        onClick={() => editor.chain().focus().addRowAfter().run()}
        disabled={!editor.can().addRowAfter()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M19,0 C21.7600532,0.00330611633 23.9966939,2.23994685 24,5 C24,7.76142375 21.7614237,10 19,10 C16.2385763,10 14,7.76142375 14,5 C14,2.23857625 16.2385763,0 19,0 Z M21.5,5.9375 C22.017767,5.9375 22.4375,5.51776695 22.4375,5 C22.4375,4.48223305 22.017767,4.0625 21.5,4.0625 L20.25,4.0625 C20.077411,4.0625 19.9375,3.92258898 19.9375,3.75 L19.9375,2.5 C19.9375,1.98223305 19.517767,1.5625 19,1.5625 C18.482233,1.5625 18.0625,1.98223305 18.0625,2.5 L18.0625,3.75 C18.0625,3.92258898 17.922589,4.0625 17.75,4.0625 L16.5,4.0625 C15.982233,4.0625 15.5625,4.48223305 15.5625,5 C15.5625,5.51776695 15.982233,5.9375 16.5,5.9375 L17.75,5.9375 C17.922589,5.9375 18.0625,6.07741102 18.0625,6.25 L18.0625,7.5 C18.0625,8.01776695 18.482233,8.4375 19,8.4375 C19.517767,8.4375 19.9375,8.01776695 19.9375,7.5 L19.9375,6.25 C19.9375,6.07741102 20.077411,5.9375 20.25,5.9375 L21.5,5.9375 Z M5,16 C3.34314575,16 2,17.3431458 2,19 C2,20.6568542 3.34314575,22 5,22 L19,22 C20.6568542,22 22,20.6568542 22,19 C22,17.3431458 20.6568542,16 19,16 L5,16 Z M5,14 L19,14 C21.7614237,14 24,16.2385763 24,19 C24,21.7614237 21.7614237,24 19,24 L5,24 C2.23857625,24 3.38176876e-16,21.7614237 0,19 C-1.2263553e-15,16.2385763 2.23857625,14 5,14 Z" />
        </svg>
      </button>
      <button
        className={`p-1   m-1 ${
          editor.can().deleteRow() ? `hover:bg-gray-200` : ` hidden `
        }`}
        onClick={() => editor.chain().focus().deleteRow().run()}
        disabled={!editor.can().deleteRow()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M13.2546893,15 C12.8333806,15.6040072 12.5048858,16.2775651 12.2898787,17 L5,17 C2.23857625,17 3.38176876e-16,14.7614237 0,12 C-1.2263553e-15,9.23857625 2.23857625,7 5,7 L19,7 C21.7614237,7 24,9.23857625 24,12 C24,12.6294813 23.8836754,13.2317936 23.6713497,13.7866134 C23.1547532,13.3234155 22.5689168,12.9358807 21.9312708,12.6414391 C21.9762852,12.4347751 22,12.220157 22,12 C22,10.3431458 20.6568542,9 19,9 L5,9 C3.34314575,9 2,10.3431458 2,12 C2,13.6568542 3.34314575,15 5,15 L13.2546893,15 Z M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M16.5,19.9375 L21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 Z" />
        </svg>
      </button>
      <button
        className={`p-1    m-1 ${
          editor.can().deleteTable() ? `hover:bg-gray-200 ` : ` hidden `
        }`}
        onClick={() => editor.chain().focus().deleteTable().run()}
        disabled={!editor.can().deleteTable()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M16.5,19.9375 L21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 Z M12.2898787,17 L9,17 L9,22 L12.6736312,22 C13.0297295,22.7496048 13.515133,23.4258795 14.1010173,24 L5,24 C2.23857625,24 -1.43817996e-15,21.7614237 -1.77635684e-15,19 L-3.55271368e-15,5 C-3.89089055e-15,2.23857625 2.23857625,5.07265313e-16 5,-1.77635684e-15 L19,-1.77635684e-15 C21.7614237,-2.28362215e-15 24,2.23857625 24,5 L24,7.82313285 C24.0122947,7.88054124 24.0187107,7.93964623 24.0187107,8 C24.0187107,8.06035377 24.0122947,8.11945876 24,8.17686715 L24,14.1010173 C23.4258795,13.515133 22.7496048,13.0297295 22,12.6736312 L22,9 L17,9 L17,12.2898787 C16.2775651,12.5048858 15.6040072,12.8333806 15,13.2546893 L15,9 L9,9 L9,15 L13.2546893,15 C12.8333806,15.6040072 12.5048858,16.2775651 12.2898787,17 Z M17,7 L22,7 L22,5 C22,3.34314575 20.6568542,2 19,2 L17,2 L17,7 Z M15,7 L15,2 L9,2 L9,7 L15,7 Z M7,2 L5,2 C3.34314575,2 2,3.34314575 2,5 L2,7 L7,7 L7,2 Z M2,9 L2,15 L7,15 L7,9 L2,9 Z M2,17 L2,19 C2,20.6568542 3.34314575,22 5,22 L7,22 L7,17 L2,17 Z" />
        </svg>
      </button>

      <button
        className={`p-1    m-1 ${
          editor.can().toggleHeaderCell() ? `hover:bg-gray-200 ` : ` hidden `
        }`}
        onClick={() => editor.chain().focus().toggleHeaderCell().run()}
        disabled={!editor.can().toggleHeaderCell()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <FontAwesomeIcon icon={faFill} />
        </svg>
      </button>
      <button
        className={`p-1   ml-1 ${
          editor.can().mergeOrSplit() ? `hover:bg-gray-200` : ` hidden `
        }`}
        onClick={() => editor.chain().focus().mergeOrSplit().run()}
        disabled={!editor.can().mergeOrSplit()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M2,19 C2,20.6568542 3.34314575,22 5,22 L19,22 C20.6568542,22 22,20.6568542 22,19 L22,5 C22,3.34314575 20.6568542,2 19,2 L5,2 C3.34314575,2 2,3.34314575 2,5 L2,19 Z M-1.16403344e-15,19 L-3.0678068e-16,5 C-6.44957556e-16,2.23857625 2.23857625,0 5,0 L19,0 C21.7614237,0 24,2.23857625 24,5 L24,19 C24,21.7614237 21.7614237,24 19,24 L5,24 C2.23857625,24 9.50500275e-16,21.7614237 -1.16403344e-15,19 Z M12,10 C12.5522847,10 13,10.4477153 13,11 L13,13 C13,13.5522847 12.5522847,14 12,14 C11.4477153,14 11,13.5522847 11,13 L11,11 C11,10.4477153 11.4477153,10 12,10 Z M12,16 C12.5522847,16 13,16.4477153 13,17 L13,20 C13,20.5522847 12.5522847,21 12,21 C11.4477153,21 11,20.5522847 11,20 L11,17 C11,16.4477153 11.4477153,16 12,16 Z M12,3 C12.5522847,3 13,3.44771525 13,4 L13,7 C13,7.55228475 12.5522847,8 12,8 C11.4477153,8 11,7.55228475 11,7 L11,4 C11,3.44771525 11.4477153,3 12,3 Z" />
        </svg>
      </button>
    </div>
  );
};

export const Test = () => {
  const { isLoading: meIsLoading, data: meData } = useQuery("me", apiMe);
  const [page, setPage] = useState(1);
  const [normId] = useState(meData.group[0].normId);
  const [uiSize, setUiSize] = useState(7);
  const [mark, setMark] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>();
  const naviage = useNavigate();
  const [isCalcOpen, setCalcOpen] = useState(false); // 계산기 활성화
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [startTest, setStartTest] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    let isUse = true;
    const logout = () => {
      localStorage.removeItem(LOCALSTORAGE_TOKEN);
      queryClient.invalidateQueries("me");
      naviage(`/tester-login`);
      window.location.reload();
    };
    socket.on("startTestToClient", (data: ICoreOutput) => {
      if (data.ok && isUse) {
        setStartTest(true);
      }
    });

    socket.on("logoutTesterToClient", async (data: ICoreOutput) => {
      if (data.ok && isUse) {
        setStartTest(false);
        if (data.error) {
          await Swal.fire({
            icon: "error",
            title: data.error,
          });
        }
        logout();
      }
    });
    if (meData.id) {
      startTestToServer();
    }

    // 리렌더링시 위 기능 사용 불가하도록 변경
    return () => {
      isUse = false;
    };
  }, [meData.id, naviage, queryClient]);

  const editor = useEditor({
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

  useEffect(() => {
    if (editor?.getHTML() === "<p></p>") {
      if (mark !== null) {
        editor?.commands.setContent(mark);
      }
    }
  }, [editor, mark]);

  const { data: questionData, isLoading: questionIsLoading } =
    useQuery<ISearchCoreOutput>(
      ["searchQuestion", "normId:" + normId, "pagesize:" + 1, "page:" + page],
      () => apiSearchQuestion({ pagesize: 1, normId, page })
    );

  const { data: markData, isLoading: markIsLoading } =
    useQuery<ISelectMarkOutput>(
      ["selectMark", "testerId:" + meData.id],
      () => apiSelectMark(),
      {
        onSuccess: (data) => {
          if (data.ok && data.mark.timeRemaining) {
            if (!timeRemaining) {
              setTimeRemaining(data.mark.timeRemaining);
            }
            if (data.mark.mark && !mark) {
              setMark(data.mark.mark);
              editor?.commands.setContent(data.mark.mark);
            }
            if (data.mark.memo && !memo) {
              setMemo(data.mark.memo);
            }
          }
        },
      }
    );

  const updateMarkMutation = useMutation(apiUpdateMark, {
    onSuccess: (data: IUpdateMarkOutput) => {
      if (data.ok) {
        console.log("마크 업데이트 완료");
      }
    },
  });

  const endTestMutation = useMutation(apiEndTest, {
    onSuccess: (data: ICoreOutput) => {
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: "검사가 정상적으로 종료되었습니다",
          showConfirmButton: false,
          timer: 1300,
        });
        naviage(`/preview`);
        window.location.reload();
      }
    },
  });

  const updateMark = () => {
    if (
      !updateMarkMutation.isLoading &&
      markData?.mark.timeRemaining &&
      timeRemaining
    ) {
      const updateMark = updateMarkMutation.mutateAsync({
        mark: editor?.getHTML(),
        memo: memo,
        timeRemaining,
      });
      updateMark.then((e) => {
        if (e.ok) {
          Swal.fire({
            icon: "success",
            title: "저장 성공",
            showConfirmButton: false,
            timer: 1300,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "저장 실패",
          });
        }
      });
    }
  };

  function secondToTime(seconds: number) {
    var hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    seconds = seconds - hours * 3600 - minutes * 60;
    if (hours >= 1) {
      return hours + "시간" + addZero(minutes) + "분" + addZero(seconds) + "초";
    }
    return addZero(minutes) + "분" + addZero(seconds) + "초";
    function addZero(num: number) {
      return (num < 10 ? "0" : "") + num;
    }
  }

  const endTest = () => {
    Swal.fire({
      title: "과제제출",
      text: "제출 이후에는 문제 풀이가 종료되어, 잔여시간이 남았더라도 이어서 진행할 수 없습니다. 정말 제출하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "제출",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed && timeRemaining) {
        const updateMark = updateMarkMutation.mutateAsync({
          mark: editor?.getHTML(),
          memo: memo,
          timeRemaining,
        });
        updateMark.then((e) => {
          if (!e.ok) {
            Swal.fire({
              icon: "error",
              title: "저장 실패",
            });
          }
        });
        endTestMutation.mutate();
      }
    });
  };

  useInterval(
    async () => {
      if (timeRemaining && startTest) {
        setTimeRemaining(timeRemaining - 1);

        if (timeRemaining <= 1) {
          await Swal.fire({
            title: "제한시간 초과로 검사가 종료됩니다",
          });
          const updateMark = updateMarkMutation.mutateAsync({
            mark: editor?.getHTML(),
            memo: memo,
            timeRemaining,
          });
          updateMark.then((e) => {
            if (!e.ok) {
              Swal.fire({
                icon: "error",
                title: "저장 실패",
              });
            }
          });
          endTestMutation.mutate();
        }
      }
    },
    timeRemaining ? (timeRemaining >= 1 ? 1000 : null) : null
  );

  useInterval(
    () => {
      if (
        !updateMarkMutation.isLoading &&
        markData?.mark.timeRemaining &&
        timeRemaining &&
        startTest
      ) {
        updateMarkMutation.mutate({
          mark: editor?.getHTML(),
          memo: memo,
          timeRemaining,
        });
      }
    },
    timeRemaining ? (timeRemaining >= 1 ? 10000 : null) : null
  );

  if (
    meIsLoading ||
    questionIsLoading ||
    markIsLoading ||
    !socket.connected ||
    !startTest
  ) {
    return <PageLoading text={"Loading"} />;
  }

  return (
    <>
      {!socket.connected ? (
        <PageLoading text={"연결중"} />
      ) : (
        <div className=" mx-auto bg-white ">
          <Helmet>
            <title>TEST</title>
          </Helmet>
          <div className=" fixed top-4 right-1/3 z-20">
            <span className=" bg-gray-500 text-gray-200 py-2 px-4 mr-2">
              잔여시간
            </span>
            <span className="bg-gray-400  py-2 px-4 mr-2">
              {timeRemaining && secondToTime(timeRemaining)}
            </span>
          </div>
          <div className="grid grid-cols-12 grid-rows-none gap-3 ">
            {/* tailwind build 시  css 속성 추가될 내용 정의 */}
            <div className=" hidden col-start-1 col-start-2 col-start-3 col-start-4 col-start-5 col-start-6 col-start-7 col-start-8 col-start-9 col-start-10 col-start-11 col-start-12 col-start-13 col-end-1 col-end-2 col-end-3 col-end-4 col-end-5 col-end-6 col-end-7 col-end-8 col-end-9 col-end-10 col-end-11 col-end-12 col-end-13 "></div>
            <div className="col-start-1 col-end-13 row-start-1  min-w-max">
              <div className=" flex  justify-center mt-4 text-md font-bold items-center ">
                {/* <div className=" w-72"></div> */}
                <div className=" flex justify-center items-center select-none text-lg">
                  <span
                    onClick={() => setUiSize(uiSize - 1)}
                    className={`cursor-pointer mx-1 ${
                      uiSize <= 5 && "text-gray-400 pointer-events-none"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </svg>
                  </span>
                  <span>화면 조정</span>
                  <span
                    onClick={() => setUiSize(uiSize + 1)}
                    className={`cursor-pointer mx-1 ${
                      uiSize >= 9 && "text-gray-400 pointer-events-none"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </svg>
                  </span>
                </div>
                {/* <div>
                  <span className=" bg-gray-500 text-gray-200 py-2 px-4 mr-2">
                    잔여시간
                  </span>
                  <span className="bg-gray-400  py-2 px-4 mr-2">
                    {timeRemaining && secondToTime(timeRemaining)}
                  </span>
                </div> */}
              </div>
            </div>
            <div
              onDragStart={(e) => {
                e.preventDefault();
                Swal.fire({
                  icon: "error",
                  title: "이미지 드래그 불가",
                });
              }}
              id="test-image"
              className={` min-h-screen select-none max-w-lg  col-start-1 col-end-${uiSize} w-full row-start-2  min-w-full p-2`}
            >
              {questionData?.totalPage && (
                <Pagination
                  page={page}
                  pageSize={1}
                  isPageSize={false}
                  totalPage={questionData?.totalPage}
                  setPage={setPage}
                  setPageSize={null}
                />
              )}
              {questionData?.result && (
                <div className=" max-h-screen overflow-auto">
                  <img src={questionData.result[0].imageUrl} alt="" />
                </div>
              )}
              {questionData?.totalPage && (
                <Pagination
                  page={page}
                  pageSize={1}
                  isPageSize={false}
                  totalPage={questionData?.totalPage}
                  setPage={setPage}
                  setPageSize={null}
                />
              )}
            </div>
            <div
              className={`max-w-lg col-start-${uiSize} col-end-13  row-start-2 min-w-full `}
            >
              {editor && (
                <div>
                  <div className="">
                    <div className="font-bold font-sans  text-2xl py-1">
                      발표자료
                    </div>
                    <MenuBar editor={editor} />
                  </div>
                  <div
                    style={{ maxHeight: "80vh" }}
                    className="  overflow-auto  border-2 border-gray-500"
                  >
                    <EditorContent className="min-w-min" editor={editor} />
                  </div>
                </div>
              )}
            </div>
            <div
              className={` bg-white col-start-13 col-end-13 rounded-l-lg pl-3 pt-2  row-start-2 border-2 border-r-0 border-gray-800 ${
                isSidebarOpen ? " w-64" : "w-12"
              }`}
            >
              <div
                className="mb-4  cursor-pointer "
                onClick={() => {
                  setIsSidebarOpen(!isSidebarOpen);
                  setCalcOpen(false);
                }}
              >
                {isSidebarOpen ? (
                  <svg
                    width="36px"
                    height="36px"
                    version="1.1"
                    className="mb-3"
                  >
                    <g>
                      <path d="M4 16V4H2v12h2zM13 15l-1.5-1.5L14 11H6V9h8l-2.5-2.5L13 5l5 5-5 5z"></path>
                    </g>
                  </svg>
                ) : (
                  <div className=" ">
                    <svg
                      width="36px"
                      height="36px"
                      version="1.1"
                      className="mb-3"
                    >
                      <g>
                        <path d="M16 16V4h2v12h-2zM6 9l2.501-2.5-1.5-1.5-5 5 5 5 1.5-1.5-2.5-2.5h8V9H6z"></path>
                      </g>
                    </svg>
                    {/* <FontAwesomeIcon icon={faBars} className=" fa-lg mb-5" /> */}
                    <FontAwesomeIcon
                      icon={faStickyNote}
                      className="fa-lg mb-3"
                    />
                    <FontAwesomeIcon icon={faCalculator} className="fa-lg" />
                  </div>
                )}
              </div>
              <div className="">
                {isSidebarOpen && (
                  <>
                    <div>
                      <div className="my-1 py-0.5 w-20 text-center border border-gray-700 ">
                        메모장
                      </div>
                      <textarea
                        onChange={(e) => setMemo(e.target.value)}
                        rows={10}
                        className=" w-60 p-2  border-2 border-gray-800 rounded-lg"
                        defaultValue={memo !== null ? memo : ""}
                      ></textarea>
                    </div>
                    <Calculator
                      isCalcOpen={isCalcOpen}
                      setCalcOpen={setCalcOpen}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="col-start-1 col-end-13 row-start-3 min-w-max">
              <div className=" flex justify-between items-center font-bold py-5 ">
                <div className="w-36"></div>
                <div>
                  <span className="bg-gray-500 border border-gray-500 text-gray-200 py-2 px-4 mr-2  ">
                    지원자 성명
                  </span>
                  <span className="border border-gray-900 text-gray-900 py-2 px-4 mr-2  ">
                    {meData.name}
                  </span>
                </div>
                <div className="select-none">
                  <span
                    onClick={() => updateMark()}
                    className="bg-gray-500 cursor-pointer hover:bg-gray-600 rounded-md border border-gray-500 text-gray-200 py-2 px-4 mr-2  "
                  >
                    저장
                  </span>
                  <span
                    onClick={() => endTest()}
                    className="bg-red-500 cursor-pointer hover:bg-red-600 rounded-md border border-red-500 text-gray-200 py-2 px-4 mr-2  "
                  >
                    제출
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
