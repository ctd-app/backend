import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() { }

  @Get("hc")
  async healthCheck(): Promise<string> {
    return new Promise(resolve => {
      resolve("Healthy")
    });
  }

  @Post("foo/bar")
  async test(): Promise<string> {
    return new Promise(resolve => {
      resolve("Test")
    });
  }
}
