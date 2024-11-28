import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ExampleService } from '../services/example.service';
import { GetAllExamplesQuery, GetExampleByIdQuery } from '@common/example/contracts';
import { CreateExampleCommand, DeleteExampleCommand, UpdateExampleCommand, UpdateVersionCommand } from '@common/example/contracts';

@Controller('examples')
export class ExampleController {
    constructor(private readonly exampleService: ExampleService) {}

    @Get()
    async getAllExamples() {
        return this.exampleService.getAll(new GetAllExamplesQuery());
    }

    @Get(':id')
    async getExampleById(@Param('id') id: string) {
        return this.exampleService.getById(new GetExampleByIdQuery(id));
    }

    @Post()
    async createExample(@Body() command: CreateExampleCommand) {
        await this.exampleService.create(command);
    }

    @Patch(':id')
    async updateExample(@Param('id') id: string, @Body() command: UpdateExampleCommand) {
        command.id = id;
        await this.exampleService.update(command);
    }

    @Delete(':id')
    async deleteExample(@Param('id') id: string, @Body() command: DeleteExampleCommand) {
        command.id = id;
        await this.exampleService.delete(command);
    }

    @Patch(':id/version')
    async updateVersion(@Param('id') id: string, @Body() command: UpdateVersionCommand) {
        command.id = id;
        await this.exampleService.updateVersion(command);
    }
}
