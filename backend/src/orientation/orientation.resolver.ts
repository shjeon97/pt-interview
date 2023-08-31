// import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { Role } from 'src/auth/role.decorator';
// import {
//   CreateOrientationInput,
//   CreateOrientationOutput,
// } from './dto/create-orientation.dto';
// import {
//   DeleteOrientationInput,
//   DeleteOrientationOutput,
// } from './dto/delete-orientation.dto';
// import {
//   EditOrientationInput,
//   EditOrientationOutput,
// } from './dto/edit-orientation.dto';
// import {
//   SelectOrientationInput,
//   SelectOrientationOutput,
// } from './dto/select-orientation.dto';
// import { OrientationService } from './orientation.service';

// @Resolver()
// export class OrientationResolver {
//   constructor(private readonly orientationService: OrientationService) {}

//   @Mutation(() => CreateOrientationOutput)
//   async createOrientation(
//     @Args('input') createOrientationInput: CreateOrientationInput,
//   ): Promise<CreateOrientationOutput> {
//     return this.orientationService.createOrientation(createOrientationInput);
//   }

//   @Query(() => SelectOrientationOutput)
//   async selectOrientation(
//     @Args('input') selectOrientationInput: SelectOrientationInput,
//   ): Promise<SelectOrientationOutput> {
//     return this.orientationService.selectOrientation(selectOrientationInput);
//   }

//   @Mutation(() => EditOrientationOutput)
//   async editOrientation(
//     @Args('input') editOrientationInput: EditOrientationInput,
//   ): Promise<EditOrientationOutput> {
//     return this.orientationService.editOrientation(editOrientationInput);
//   }

//   @Mutation(() => DeleteOrientationOutput)
//   @Role(['SuperAdmin'])
//   async deleteOrientation(
//     @Args('input') deleteOrientationInput: DeleteOrientationInput,
//   ): Promise<DeleteOrientationOutput> {
//     return this.orientationService.deleteOrientation(deleteOrientationInput);
//   }
// }
