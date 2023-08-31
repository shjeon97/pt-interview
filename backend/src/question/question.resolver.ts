// import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { Role } from 'src/auth/role.decorator';
// import {
//   CreateQuestionInput,
//   CreateQuestionOutput,
// } from './dto/create-question.dto';
// import {
//   DeleteQuestionInput,
//   DeleteQuestionOutput,
// } from './dto/delete-question.dto';
// import { EditQuestionInput, EditQuestionOutput } from './dto/edit-question.dto';
// import {
//   SelectQuestionInput,
//   SelectQuestionOutput,
// } from './dto/select-question.dto';
// import { QuestionService } from './question.service';

// @Resolver()
// export class QuestionResolver {
//   constructor(private readonly questionService: QuestionService) {}

//   @Mutation(() => CreateQuestionOutput)
//   async createQuestion(
//     @Args('input') createQuestionInput: CreateQuestionInput,
//   ): Promise<CreateQuestionOutput> {
//     return this.questionService.createQuestion(createQuestionInput);
//   }

//   @Query(() => SelectQuestionOutput)
//   async selectQuestion(
//     @Args('input') selectQuestionInput: SelectQuestionInput,
//   ): Promise<SelectQuestionOutput> {
//     return this.questionService.selectQuestion(selectQuestionInput);
//   }

//   @Mutation(() => EditQuestionOutput)
//   @Role(['SuperAdmin'])
//   async editQuestion(
//     @Args('input') editQuestionInput: EditQuestionInput,
//   ): Promise<EditQuestionOutput> {
//     return this.questionService.editQuestion(editQuestionInput);
//   }

//   @Mutation(() => DeleteQuestionOutput)
//   @Role(['SuperAdmin'])
//   async deleteQuestion(
//     @Args('input') deleteQuestionInput: DeleteQuestionInput,
//   ): Promise<DeleteQuestionOutput> {
//     return this.questionService.deleteQuestion(deleteQuestionInput);
//   }
// }
