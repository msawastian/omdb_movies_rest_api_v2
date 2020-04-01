import { AuthController } from "./auth.controller";
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { AddUserDTO } from "~dtos/user/add_user.dto";

describe('Auth Controller', () => {
  let authController: AuthController;
  let authService;

  const createMockAuthService = () => ({
    login: jest.fn(),
    register: jest.fn()
  });

  beforeEach(async () => {
    authService = createMockAuthService();

    const module = await Test.createTestingModule(
      {
        providers: [AuthService],
        controllers: [AuthController]
      }
    )
    .overrideProvider(AuthService)
    .useValue(authService)
    .compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('Register an user', () => {
    const prepareTestUser = (): AddUserDTO => {
      return new AddUserDTO({
        username: 'Test User',
        email: 'testuser@test.com',
        password: 'password'
      })
    };

    it('should return an user info object', async () => {
      const testUser = prepareTestUser();
      const {password, ...userDTO} = testUser;
      jest.spyOn(authService, 'register').mockImplementation(async () => userDTO);
      const results = await authController.register(testUser);

      expect(results).toBeInstanceOf(Object);
      expect(results.username).toEqual(testUser.username);
      expect(results.email).toEqual(testUser.email);
    });

    it('should call AuthService.register() only once', async () => {
      const spy = jest.spyOn(authService, 'register').mockImplementation(async () => undefined);
      await authController.register(prepareTestUser());
      
      expect(spy).toBeCalledTimes(1);
    });

    it('should call AuthService.register() with a given parameter', async () => {
      const spy = jest.spyOn(authService, 'register').mockImplementation(async () => undefined);
      const testUser = prepareTestUser();
      await authController.register(testUser);

      expect(spy).toBeCalledWith(testUser);
    })
  });

  describe('Log in an user', () => {
    it('should call AuthService.login() only once', async () => {
      const user = { username: 'test', id: 1};
      const spy = jest.spyOn(authService, 'login').mockImplementation(async () => undefined);
      await authController.login(user);
      
      expect(spy).toBeCalledTimes(1);
    })
  })
});