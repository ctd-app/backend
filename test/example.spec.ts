import mongoose from 'mongoose';
import { UniqueIdentifier } from '@common/seedwork';
import { MongoSchema } from 'src/schemas/mongo.schema';
import { Example } from '@common/example/Example';
import { ExampleType } from '@common/example/Type';
import { Test, TestingModule } from '@nestjs/testing';
import { ExampleService } from 'src/services/example.service';
import { ExampleRepository } from 'src/repositories/example.repository';
import { EventPublisherService } from 'src/services/eventPublisher.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ExampleMetadata } from '@common/example/Metadata';
import { testRepository } from './helpers/testRepository';
import { cleanupTests, initializeTests } from './setup.spec';
import * as Commands from "@common/example/contracts/commands"
import * as Queries from "@common/example/contracts/queries"
  
const Schema = MongoSchema(Example);
const Model = mongoose.model(Example.name, Schema);

beforeAll(initializeTests)
afterAll(cleanupTests);

describe('Schema Tests', () => {
  it('should have the correct Example schema structure', () => {
    const example = MongoSchema(Example).obj;
    const type = MongoSchema(ExampleType).obj;
    const metadata = MongoSchema(ExampleMetadata).obj;

    expect(example).toHaveProperty('_id');
    expect(example).toHaveProperty('name');
    expect(example).toHaveProperty('type');
    expect(example).toHaveProperty('metadata');
    expect(type).toHaveProperty('id');
    expect(type).toHaveProperty('name');
    expect(metadata).toHaveProperty('description');
    expect(metadata).toHaveProperty('version');
  });

  // Your tests here...
  it('should create and store an Example document in the database', async () => {
    const exampleInstance = new Model({
      _id: new mongoose.Types.ObjectId().toString(),
      name: new UniqueIdentifier({ value: 'Sample Name' }),
      type: ExampleType.Default,
      metadata: { description: 'Sample Description', version: 1 },
    });

    await exampleInstance.save(); // Save the example to the database

    const doc: any = await Model.findById(exampleInstance._id).exec();
    const example = new Example(doc);

    expect(example).not.toBeNull();
    expect(example.name.value).toEqual('Sample Name');
    expect(example.type.name).toEqual('Default');
    expect(example.metadata.description).toEqual('Sample Description');
    expect(example.metadata.version).toEqual(1);

    await Model.deleteOne({ _id: exampleInstance._id }); // Clean up after test
  });
});

describe('ExampleService', () => {
  let service: ExampleService;
  let mockRepository: Partial<ExampleRepository>;

  const defaultExample = new Example({
    name: new UniqueIdentifier("Example"),
    metadata: new ExampleMetadata({ description: "Test Description", version: 1 }),
    type: ExampleType.Default,
  })

  beforeAll(async () => {
    mockRepository = testRepository(defaultExample);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EventEmitterModule.forRoot(),
      ], // Make sure DatabaseModule is included
      providers: [
        { provide: ExampleRepository, useValue: mockRepository },
        ExampleService, 
        EventPublisherService
      ]
    }).compile();

    service = module.get<ExampleService>(ExampleService);
  });

  it('should return all examples', async () => {
    const examples = await service.getAll(new Queries.GetAllExamplesQuery());
    expect(examples).toHaveLength(1);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it('should return an example by id', async () => {
    const example = await service.getById(new Queries.GetExampleByIdQuery('existing-id'));
    expect(example).toBeDefined();
    expect(example.id.value).toEqual(defaultExample.id.value);
    expect(mockRepository.findById).toHaveBeenCalled();
  });

  it('should create a new example', async () => {
    const command = new Commands.CreateExampleCommand()
    command.name = 'New Example';
    command.type = 'Default';
    command.description = 'New Description';
    command.version = 1
    await service.create(command);
    expect(mockRepository.insert).toHaveBeenCalled();
  });

  it('should update an existing example', async () => {
    const command = new Commands.UpdateExampleCommand();
    command.name = 'Updated Name';
    command.id = defaultExample.id.value;
    command.metadata = { description: 'Updated Description', version: 2 }
    await service.update(command);
    expect(mockRepository.update).toHaveBeenCalled();
  });

  it('should delete an example', async () => {
    const command = new Commands.DeleteExampleCommand();
    command.id = defaultExample.id.value;
    await service.delete(command);
    expect(mockRepository.delete).toHaveBeenCalled();
  });

  it('should update the version of an example', async () => {
    const command = new Commands.UpdateVersionCommand();
    command.id = defaultExample.id.value;
    command.newVersion = 2;
    await service.updateVersion(command);
    expect(mockRepository.update).toHaveBeenCalled();
  });
});
