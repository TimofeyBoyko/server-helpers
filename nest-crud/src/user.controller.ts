import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TGetAllUsersSearchParams, UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() { name, age }: { name: string; age: number }) {
    return this.userService.createUser(name, age);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Get()
  getAllUsers(@Query() searchParams: TGetAllUsersSearchParams) {
    return this.userService.getAllUsers(searchParams);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() { name, age }: { name: string; age: number },
  ) {
    return this.userService.updateUser(id, name, age);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
