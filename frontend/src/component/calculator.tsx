/* eslint-disable no-useless-escape */
/* eslint-disable no-eval */
import { useEffect, useState } from "react";

export const Calculator = ({ isCalcOpen, setCalcOpen }: any) => {
  const [re, setRe] = useState(false);
  const [exp, setExp] = useState("");
  const [tmp, setTmp] = useState("");

  const numToCom = (n: any) => {
    const mArry = [];
    for (let i = 0; i < n.length; i++) {
      //각 기호단위로 나눠 배열 만들기
      if (n[i] === "-" || n[i] === "+" || n[i] === "×" || n[i] === "÷") {
        mArry.push(n[i]);
      } else {
        if (
          mArry[mArry.length - 1] === "-" ||
          mArry[mArry.length - 1] === "+" ||
          mArry[mArry.length - 1] === "×" ||
          mArry[mArry.length - 1] === "÷"
        ) {
          mArry.push(n[i]);
        } else {
          //처음부토 숫자일때
          if (mArry.length === 0) {
            mArry.push(n[i]);
          } else {
            //그 외
            mArry[mArry.length - 1] += n[i];
          }
        }
      }
    }
    //배열을 콤마찍어 내보내기
    return mArry
      .map((num) => {
        if (num === "-" || num === "+" || num === "×" || num === "÷") {
          return num;
        } else {
          //소숫점 콤마 제거
          const parts = num.split(".");
          return (
            parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
            (parts[1] !== undefined ? "." + parts[1] : "")
          );
        }
      })
      .join("");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keyEvent = (e: { keyCode: any; key?: any; shiftKey?: any }) => {
    const checkrule =
      exp.endsWith(".") ||
      exp.endsWith("+") ||
      exp.endsWith("-") ||
      exp.endsWith("@") ||
      exp.endsWith("x") ||
      exp === "";

    if (exp.length > 17) {
      if (e.keyCode === 8) {
        //지우기
        if (exp.slice(exp.length - 2, exp.length) === "0.") {
          setExp(exp.slice(0, exp.length - 2));
        } else {
          setExp(exp.slice(0, exp.length - 1));
        }
      } else if (e.keyCode === 13) {
        //계산
        const r = /^[0-9+\-*/(). ]*$/g;
        const tmpExp = exp.replace(/\@/g, "/").replace(/\x/g, "*");

        const isCalc =
          r.test(tmpExp) &&
          !tmpExp.endsWith("+") &&
          !tmpExp.endsWith("-") &&
          !tmpExp.endsWith("*") &&
          !tmpExp.endsWith("/");

        if (isCalc) {
          setExp(String(parseFloat(eval(tmpExp).toFixed(2))));
          setTmp(exp);
          setRe(true);
        }
      }
      return;
    }

    if (re) {
      if (e.keyCode === 13) {
        return;
      }

      setTmp(exp);
      setRe(false);
      setExp("");
      return;
    }

    if (
      (!e.shiftKey && e.keyCode >= 48 && e.keyCode <= 57) ||
      (!e.shiftKey && e.keyCode >= 96 && e.keyCode <= 105)
    ) {
      if (e.keyCode === 48 || e.keyCode === 96) {
        //시작 0과 .예외처리
        if (checkrule) {
          if (exp.endsWith(".")) {
            setExp(exp + "0");
          } else {
            setExp(exp + "0.");
          }

          return;
        }
      }
      //수정 (혹시 첨보는 오류가 생기면 여기를 고려)
      if (exp === "0") {
        setExp(e.key);
        console.log(e.key);
      } else {
        setExp(exp + e.key);
      }
    } else if (e.keyCode === 8) {
      //지우기
      if (exp.slice(exp.length - 2, exp.length) === "0.") {
        setExp(exp.slice(0, exp.length - 2));
      } else {
        setExp(exp.slice(0, exp.length - 1));
      }
    } else if (exp === "" && e.keyCode === 109) {
      setExp(exp + "-");
    } else if (exp === "" && e.keyCode === 189) {
      setExp(exp + "-");
    } else if (checkrule) {
      return;
    } else if (e.keyCode === 110 || e.keyCode === 190) {
      //.
      //중복 . 제거
      const tmpArry = exp
        .replace(/\@/g, ",")
        .replace(/\x/g, ",")
        .replace(/\+/g, ",")
        .replace(/\-/g, ",")
        .split(",");

      if (tmpArry[tmpArry.length - 1].includes(".")) {
        return;
      } else {
        setExp(exp + ".");
      }
    } else if (e.keyCode === 106) {
      //*
      setExp(exp + "x");
    } else if (e.keyCode === 109) {
      // -
      setExp(exp + "-");
    } else if (e.keyCode === 107) {
      // +
      setExp(exp + "+");
    } else if (e.keyCode === 111) {
      // /
      setExp(exp + "@");
    } else if (e.keyCode === 13) {
      //계산
      const r = /^[0-9+\-*/(). ]*$/g;
      const tmpExp = exp.replace(/@/g, "/").replace(/\x/g, "*");
      const isCalc =
        r.test(tmpExp) &&
        !tmpExp.endsWith("+") &&
        !tmpExp.endsWith("-") &&
        !tmpExp.endsWith("*") &&
        !tmpExp.endsWith("/");
      if (isCalc) {
        setExp(String(parseFloat(eval(tmpExp).toFixed(5))));
        setTmp(exp);
      }
    } else if (e.shiftKey && e.keyCode === 187) {
      // + mac & window
      setExp(exp + "+");
    } else if (!e.shiftKey && e.keyCode === 189) {
      // - mac & window
      setExp(exp + "-");
    } else if (e.shiftKey && e.keyCode === 56) {
      //* mac & window
      setExp(exp + "x");
    } else if (e.keyCode === 191) {
      // / mac & window
      setExp(exp + "@");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyEvent);
    return () => document.removeEventListener("keydown", keyEvent);
  }, [exp, tmp, re, keyEvent]);

  return (
    <div className=" cursor-pointer select-none">
      <div>
        <div className="my-1 py-0.5 w-20 text-center border border-gray-700 ">
          계산기
        </div>
      </div>
      <div className=" w-60 border-2 border-gray-700 p-5 shadow-xl  rounded-md  overflow-hidden">
        <div
          className={`w-full h-12 border border-gray-800 px-2 py-1 overflow-x-auto rounded-md text-right ${
            exp.length > 16 ? "text-sm" : "text-base"
          }`}
        >
          <div className=" h-2.5 mb-1 text-xs text-gray-500 text-right">
            {numToCom(tmp.replace(/\@/g, "÷").replace(/\x/g, "×"))}
          </div>
          {numToCom(exp.replace(/\@/g, "÷").replace(/\x/g, "×"))}
        </div>
        <div className="grid gap-1 gap-y-2 items-center overflow-hidden w-full   text-center my-2 ">
          <div
            className=" py-1 col-start-1 col-end-7 row-end-1 bg-gray-500 text-white hover:bg-gray-600 rounded-md"
            onClick={() => {
              setExp("");
              setTmp("");
              setRe(false);
            }}
          >
            C
          </div>
          <div
            className="py-1 col-start-7 col-end-10 row-end-1 bg-gray-500 text-white hover:bg-gray-600 rounded-md"
            onClick={() => {
              setExp("");
              setRe(false);
            }}
          >
            CE
          </div>
          <div
            className="py-1 col-start-10 col-end-13 row-end-1 bg-gray-500 text-white hover:bg-gray-600 rounded-md"
            onClick={() => keyEvent({ keyCode: 111 })}
          >
            ÷
          </div>

          <div
            className="py-1 col-start-1 col-end-4 row-end-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            onClick={() => keyEvent({ keyCode: 55, key: "7" })}
          >
            7
          </div>
          <div
            className="py-1 col-start-4 col-end-7 row-end-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            onClick={() => keyEvent({ keyCode: 56, key: "8" })}
          >
            8
          </div>
          <div
            className="py-1 col-start-7 col-end-10 row-end-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            onClick={() => keyEvent({ keyCode: 57, key: "9" })}
          >
            9
          </div>
          <div
            className="py-1 col-start-10 col-end-13 row-end-2 bg-gray-500 text-white hover:bg-gray-600 rounded-md"
            onClick={() => keyEvent({ keyCode: 106 })}
          >
            ×
          </div>

          <div
            className="py-1 col-start-1 col-end-4 row-end-3 bg-gray-100 hover:bg-gray-200 rounded-md"
            onClick={() => keyEvent({ keyCode: 52, key: "4" })}
          >
            4
          </div>
          <div
            className="py-1 col-start-4 col-end-7 row-end-3 bg-gray-100 hover:bg-gray-200 rounded-md"
            onClick={() => keyEvent({ keyCode: 53, key: "5" })}
          >
            5
          </div>
          <div
            className="py-1 col-start-7 col-end-10 row-end-3 bg-gray-100 hover:bg-gray-200 rounded-md"
            onClick={() => keyEvent({ keyCode: 54, key: "6" })}
          >
            6
          </div>
          <div
            className="py-1 col-start-10 col-end-13 row-end-3 bg-gray-500 text-white hover:bg-gray-600 rounded-md"
            onClick={() => keyEvent({ keyCode: 109, key: "-" })}
          >
            -
          </div>

          <div
            className="py-1 col-start-1 col-end-4 row-end-4 bg-gray-100 hover:bg-gray-200 rounded-md"
            onClick={() => keyEvent({ keyCode: 49, key: "1" })}
          >
            1
          </div>
          <div
            className="py-1 col-start-4 col-end-7 row-end-4 bg-gray-100 hover:bg-gray-200 rounded-md"
            onClick={() => keyEvent({ keyCode: 50, key: "2" })}
          >
            2
          </div>
          <div
            className="py-1 col-start-7 col-end-10 row-end-4 bg-gray-100 hover:bg-gray-200 rounded-md"
            onClick={() => keyEvent({ keyCode: 51, key: "3" })}
          >
            3
          </div>
          <div
            className="py-1 col-start-10 col-end-13 row-end-4 bg-gray-500 text-white hover:bg-gray-600 rounded-md"
            onClick={() => keyEvent({ keyCode: 107, key: "+" })}
          >
            +
          </div>

          <div
            className="py-1 col-start-1 col-end-7 row-end-5 bg-gray-100 hover:bg-gray-200 rounded-md"
            onClick={() => keyEvent({ keyCode: 48, key: "0" })}
          >
            0
          </div>
          <div
            className="py-1 col-start-7 col-end-10 row-end-5 bg-gray-100 hover:bg-gray-200 rounded-md"
            onClick={() => keyEvent({ keyCode: 110, key: "." })}
          >
            .
          </div>
          <div
            className="py-1 col-start-10 col-end-13 row-end-5 bg-gray-500 text-white hover:bg-gray-600 rounded-md"
            onClick={() => keyEvent({ keyCode: 13 })}
          >
            =
          </div>
        </div>
      </div>
    </div>
  );
};
