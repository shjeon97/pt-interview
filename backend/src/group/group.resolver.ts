// import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { AuthUser } from 'src/auth/auth-user.decorator';
// import { Role } from 'src/auth/role.decorator';
// import { CreateGuideOutput } from 'src/guide/dto/create-guide.dto';
// import { User } from 'src/user/entity/user.entity';
// import { AllGroupInput, AllGroupOutput } from './dto/all-group.dto';
// import { CreateGroupInput, CreateGroupOutput } from './dto/create-group.dto';
// import { DeleteGroupInput, DeleteGroupOutput } from './dto/delete-group.dto';
// import { DetailGroupInput, DetailGroupOutput } from './dto/detail-group.dto';
// import { EditGroupInput, EditGroupOutput } from './dto/edit-group.dto';
// import { SelectGroupInput, SelectGroupOutput } from './dto/select-group.dto';
// import { GroupService } from './group.service';

// @Resolver()
// export class GroupResolver {
//   constructor(private readonly groupService: GroupService) {}

//   @Mutation(() => CreateGuideOutput)
//   @Role(['SuperAdmin'])
//   async createGroup(
//     @Args('input') createGroupInput: CreateGroupInput,
//   ): Promise<CreateGroupOutput> {
//     return this.groupService.createGroup(createGroupInput);
//   }

//   @Mutation(() => EditGroupOutput)
//   @Role(['SuperAdmin'])
//   async editGroup(
//     @Args('input') editGroupInput: EditGroupInput,
//   ): Promise<EditGroupOutput> {
//     return this.groupService.editGroup(editGroupInput);
//   }

//   @Query(() => SelectGroupOutput)
//   @Role(['SuperAdmin_Admin'])
//   async selectGroup(
//     @AuthUser() authUser: User,
//     @Args('input') selectGroupInput: SelectGroupInput,
//   ): Promise<SelectGroupOutput> {
//     return this.groupService.selectGroup(authUser, selectGroupInput);
//   }

//   @Mutation(() => DeleteGroupOutput)
//   @Role(['SuperAdmin'])
//   async deleteGroup(
//     @Args('input') deleteGroupInput: DeleteGroupInput,
//   ): Promise<DeleteGroupOutput> {
//     return this.groupService.deleteGroup(deleteGroupInput);
//   }

//   @Query(() => AllGroupOutput)
//   @Role(['SuperAdmin_Admin'])
//   async allGroup(
//     @AuthUser() authUser: User,
//     @Args('input') allGroupInput: AllGroupInput,
//   ): Promise<AllGroupOutput> {
//     return this.groupService.allGroup(authUser, allGroupInput);
//   }

//   @Query(() => DetailGroupOutput)
//   @Role(['SuperAdmin_Admin'])
//   async detailGroup(
//     @AuthUser() authUser: User,
//     @Args('input') detailGroupInput: DetailGroupInput,
//   ): Promise<DetailGroupOutput> {
//     return this.groupService.detailGroup(authUser, detailGroupInput);
//   }
// }
