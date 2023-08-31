import React from "react";

interface IConfirmModelProp {
  next: any;
  prop: any;
  isModelOpen: boolean;
  setModelOpen: any;
  actionText: string;
}

export const ConfirmModel: React.FC<IConfirmModelProp> = ({
  next,
  prop,
  isModelOpen,
  setModelOpen,
  actionText,
}) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto select-none">
      <div className=" items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center block p-0">
        <div
          onClick={() => {
            setModelOpen(!isModelOpen);
          }}
          className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity"
          aria-hidden="true"
        ></div>
        <span className="inline-block align-middle h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block ring-2 ring-gray-400 bg-white rounded-sm text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-lg w-full">
          <div className="bg-white pt-5 pb-4  ">
            <div className="flex items-start">
              <div className=" mt-0 ml-4 text-left">
                <p className=" text-gray- font-bold">{actionText}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-300 px-4 py-1  flex flex-row-reverse">
            <button
              onClick={() => next(prop)}
              type="button"
              className=" inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600   font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-3 w-auto"
            >
              예
            </button>
            <button
              onClick={() => {
                setModelOpen(!isModelOpen);
              }}
              type="button"
              className=" inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-bold  text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-0 ml-3 w-auto "
            >
              아니오
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
