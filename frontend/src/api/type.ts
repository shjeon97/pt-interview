import { UserRole, UserTestState } from "../constant";

export interface ICoreEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IPaginationInput {
  page: number;
  pagesize: number;
}

export interface ICoreOutput {
  ok: boolean;
  error?: string;
}

export interface IPaginationOutput extends ICoreOutput {
  totalPage: number;
  totalResult?: number;
}

export interface IPaginationInput {
  pagesize: number;
  page: number;
}

export interface ISearchInput {
  pagesize: number;
  page: number;
  searchType?: string;
  searchValue?: string;
}

export interface ILoginInput {
  name: string;
  password: string;
  role: UserRole;
}

export interface ICoreInput {
  normId: number;
  page: number;
}

export interface ISearchGroupOutput extends IPaginationOutput {
  result?: IGroup[];
}

export interface ISearchUserInput extends ISearchInput {
  role: UserRole;
}

export interface ISearchCoreInput extends IPaginationInput {
  normId: number;
}

export interface ISearchUserOutput extends IPaginationOutput {
  result?: IUser[];
}

export interface ISearchNormOutput extends IPaginationOutput {
  result?: INorm[];
}

export interface ISearchCoreOutput extends IPaginationOutput {
  result?: IDetailImage[];
}

export interface IAllNormOutput extends ICoreOutput {
  result?: INorm[];
}

export interface IAllGroupOutput extends ICoreOutput {
  result?: IGroup[];
}

export interface IMeOutput extends ICoreEntity {
  role: UserRole;
  name: string;
  testState: UserTestState;
  ptTime: string;
  isAttend: boolean;
  group?: IGroup[];
}

export interface IGroup extends ICoreEntity {
  name: string;
  normId: number;
  startDate: Date;
  endDate: Date;
  norm: INorm;
}

export interface INorm extends ICoreEntity {
  name: string;
  timeLimit: number;
}

export interface ICoreImageEntity extends ICoreEntity {
  norm: INorm;
  normId: number;
  page: number;
  image: string;
}

export interface IDetailImage extends ICoreImageEntity {
  id: number;
  normId: number;
  page: number;
  imageUrl: string;
}

export interface ILoginOutput extends ICoreOutput {
  token?: string;
}

export interface IEditGroupInput {
  groupId: number;
  name: string;
  normId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface IFormSearchInput {
  searchType: string;
  searchValue: string;
}

export interface IEditUserInput {
  userId: number;
  name: string;
  password?: string;
  ptTime?: string;
  groupIdList?: number[];
}

export interface IEditTesterInput {
  userId: number;
  timeRemaining: number;
  testState: UserTestState;
}

export interface IEditNormInput {
  normId: number;
  name?: string;
  timeLimit?: number;
}

export interface ICreateGroupInput {
  name: string;
  normId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface ICreateUser {
  name: string;
  password: string;
  groupIdList?: number[];
  ptTime?: string;
}

export interface ICreateUserInput {
  userList: ICreateUser[];
  role: UserRole;
}

export interface ICreateTesterInput {
  name: string;
  password: string;
  ptTime: string;
  groupIdList?: number[];
}

export interface ICreateNormInput {
  name: string;
  timeLimit: number;
}

export interface ICoreCreateInput {
  normId: number;
  page: number;
  file: any;
}

export interface IUpdateMarkInput {
  mark?: string;
  memo?: string;
  timeRemaining: number;
}

export interface IDetailGroupOutput extends ICoreOutput {
  result?: {
    detailUserList?: IDetailUser[];
    group: IGroup;
  };
}

export interface ISelectUserOutput extends ICoreOutput {
  result?: IUser;
}

export interface ISelectNormOutput extends ICoreOutput {
  result?: INorm;
}

export interface ISelectQuestionOutput extends ICoreOutput {
  imageUrl: string;
}

export interface ISelectMarkOutput extends ICoreOutput {
  mark: IMark;
}

export interface IUpdateMarkOutput extends ICoreOutput {
  mark: IMark;
}

export interface IDetailUser {
  user: IUser;
  mark?: IMark;
}

export interface IUser extends ICoreEntity {
  role: UserRole;
  name: string;
  group?: IGroup[];
  testState: UserTestState;
  ptTime?: Date;
  isAttend: boolean;
  password?: string;
}

export interface IMark extends ICoreEntity {
  userId: number;
  mark?: string;
  memo?: string;
  timeRemaining: number;
  startDate?: Date;
  endDate?: Date;
}

export interface IFindGuideRelatedToNormInput {
  normId: number;
}

export interface IDetailGuide {
  page: number;
  imageUrl: string;
}

export interface IFindGuideRelatedToNormOutput extends ICoreOutput {
  guideList?: IDetailGuide[];
  totalPage?: number;
}
