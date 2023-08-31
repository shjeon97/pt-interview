// import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { Role } from 'src/auth/role.decorator';
// import { AllNormOutput } from './dto/all-norm.dto';
// import { CreateNormInput, CreateNormOutput } from './dto/create-norm.dto';
// import { DeleteNormInput, DeleteNormOutput } from './dto/delete-norm.dto';
// import { EditNormInput, EditNormOutput } from './dto/edit-norm.dto';
// import { SelectNormInput, SelectNormOutput } from './dto/select-norm.dto';
// import { NormService } from './norm.service';

// @Resolver()
// export class NormResolver {
//   constructor(private readonly normService: NormService) {}

//   @Mutation(() => CreateNormOutput)
//   async createNorm(
//     @Args('input') createNormInput: CreateNormInput,
//   ): Promise<CreateNormOutput> {
//     return this.normService.createNorm(createNormInput);
//   }

//   @Query(() => SelectNormOutput)
//   async selectNorm(
//     @Args('input') selectNormInput: SelectNormInput,
//   ): Promise<SelectNormOutput> {
//     return this.normService.selectNorm(selectNormInput);
//   }

//   @Query(() => AllNormOutput)
//   @Role(['SuperAdmin'])
//   async allNorm(): Promise<AllNormOutput> {
//     return this.normService.allNorm();
//   }

//   @Mutation(() => EditNormOutput)
//   @Role(['SuperAdmin'])
//   async editNorm(
//     @Args('input') editNormInput: EditNormInput,
//   ): Promise<EditNormOutput> {
//     return this.normService.editNorm(editNormInput);
//   }

//   @Mutation(() => DeleteNormOutput)
//   @Role(['SuperAdmin'])
//   async deleteNorm(
//     @Args('input') deleteNormInput: DeleteNormInput,
//   ): Promise<DeleteNormOutput> {
//     return this.normService.deleteNorm(deleteNormInput);
//   }
// }
