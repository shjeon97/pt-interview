// import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { Role } from 'src/auth/role.decorator';
// import { CreateGuideInput, CreateGuideOutput } from './dto/create-guide.dto';
// import { DeleteGuideInput, DeleteGuideOutput } from './dto/delete-guide.dto';
// import { EditGuideInput, EditGuideOutput } from './dto/edit-guide.dto';
// import { SelectGuideInput, SelectGuideOutput } from './dto/select-guide.dto';
// import { GuideService } from './guide.service';

// @Resolver()
// export class GuideResolver {
//   constructor(private readonly guideService: GuideService) {}

//   @Mutation(() => CreateGuideOutput)
//   async createGuide(
//     @Args('input') createGuideInput: CreateGuideInput,
//   ): Promise<CreateGuideOutput> {
//     return this.guideService.createGuide(createGuideInput);
//   }

//   @Query(() => SelectGuideOutput)
//   async selectGuide(
//     @Args('input') selectGuideInput: SelectGuideInput,
//   ): Promise<SelectGuideOutput> {
//     return this.guideService.selectGuide(selectGuideInput);
//   }

//   @Mutation(() => EditGuideOutput)
//   @Role(['SuperAdmin'])
//   async editGuide(
//     @Args('input') editGuideInput: EditGuideInput,
//   ): Promise<EditGuideOutput> {
//     return this.guideService.editGuide(editGuideInput);
//   }

//   @Mutation(() => DeleteGuideOutput)
//   @Role(['SuperAdmin'])
//   async deleteGuide(
//     @Args('input') deleteGuideInput: DeleteGuideInput,
//   ): Promise<DeleteGuideOutput> {
//     return this.guideService.deleteGuide(deleteGuideInput);
//   }
// }
