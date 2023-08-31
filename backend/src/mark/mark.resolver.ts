// import { Mutation, Resolver } from '@nestjs/graphql';
// import { AuthUser } from 'src/auth/auth-user.decorator';
// import { Role } from 'src/auth/role.decorator';
// import { CoreOutput } from 'src/common/dtos/output.dto';
// import { User } from 'src/user/entity/user.entity';
// import { CreateMarkOutput } from './dto/create-mark.dto';
// import { UpdateMarkInput, UpdateMarkOutput } from './dto/update-mark.dto';
// import { MarkService } from './mark.service';

// @Resolver()
// export class MarkResolver {
//   constructor(private readonly markService: MarkService) {}

//   @Mutation(() => CreateMarkOutput)
//   @Role(['Tester'])
//   async createMark(@AuthUser() tester: User): Promise<CreateMarkOutput> {
//     return this.markService.createMark(tester);
//   }

//   @Mutation(() => UpdateMarkOutput)
//   @Role(['Tester'])
//   async updateMark(
//     @AuthUser() tester: User,
//     updateMarkInput: UpdateMarkInput,
//   ): Promise<UpdateMarkOutput> {
//     return this.markService.updateMark(tester, updateMarkInput);
//   }

//   @Mutation(() => CoreOutput)
//   @Role(['Tester'])
//   async endTest(@AuthUser() tester: User): Promise<CoreOutput> {
//     return this.markService.endTest(tester);
//   }
// }
