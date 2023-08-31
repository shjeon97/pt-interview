// import { Inject } from '@nestjs/common';
// import { AuthUser } from 'src/auth/auth-user.decorator';
// import { Role } from 'src/auth/role.decorator';
// import { NEW_TESTER_STATE } from 'src/common/common.constants';
// import { Mark } from 'src/mark/entity/mark.entity';
// import {
//   CreateUserInput,
//   CreateUserOutput,
// } from 'src/user/dto/create-user.dto';
// import { DeleteUserInput, DeleteUserOutput } from './dto/delete-user.dto';
// import { EditUserInput, EditUserOutput } from './dto/edit-user.dto';
// import { LoginInput, LoginOutput } from './dto/login.dto';
// import { TesterStateOutput } from './dto/tester-state.dto';
// import { User } from './entity/user.entity';
// import { UserService } from './user.service';

// @Resolver()
// export class UserResolver {
//   constructor(
//     private readonly userService: UserService,
//     @Inject(PUB_SUB) private readonly pubSub: PubSub,
//   ) {}

//   @Mutation(() => CreateUserOutput)
//   @Role(['SuperAdmin'])
//   async createUser(
//     @Args('input') createUserInput: CreateUserInput,
//   ): Promise<CreateUserOutput> {
//     return this.userService.createUser(createUserInput);
//   }

//   @Mutation(() => LoginOutput)
//   async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
//     return this.userService.login(loginInput);
//   }

//   @Query(() => User)
//   @Role(['Any'])
//   async me(@AuthUser() authUser: User) {
//     return authUser;
//   }

//   @Mutation(() => EditUserOutput)
//   @Role(['SuperAdmin'])
//   async editUser(
//     @Args('input') editUserInput: EditUserInput,
//   ): Promise<EditUserOutput> {
//     return this.userService.editUser(editUserInput);
//   }

//   @Mutation(() => DeleteUserOutput)
//   @Role(['SuperAdmin'])
//   async deleteUser(
//     @Args('input') deleteUserInput: DeleteUserInput,
//   ): Promise<DeleteUserOutput> {
//     return this.userService.deleteUser(deleteUserInput);
//   }

//   @Subscription(() => TesterStateOutput, {
//     filter: (
//       { testerState: { tester } }: { testerState: TesterStateOutput },
//       _,
//       { user, mark }: { user: User; mark: Mark },
//     ) => {
//       if (tester) {
//         return tester.id === user.id;
//       } else if (mark) {
//         return true;
//       }
//       return false;
//     },
//     resolve: (
//       { testerState: { tester, mark } }: { testerState: TesterStateOutput },
//       _,
//       { user, mark: uMark }: { user: User; mark: Mark },
//     ) => {
//       if (tester) {
//         return { tester, mark };
//       } else {
//         uMark.timeRemaining = uMark.timeRemaining - 1;
//         return { tester: user, mark: uMark };
//       }
//     },
//   })
//   @Role(['Tester'])
//   testerState() {
//     return this.pubSub.asyncIterator(NEW_TESTER_STATE);
//   }
// }
