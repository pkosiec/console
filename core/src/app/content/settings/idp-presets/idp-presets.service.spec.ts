import { TestBed } from '@angular/core/testing';
import { IdpPresetsService } from './idp-presets.service';
import { GraphQLClientService } from '../../../shared/services/graphql-client-service';
import { Observable } from 'rxjs/Observable';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

const idpPresetCreationSuccess = {
  createIDPPreset: {
    name: 'test'
  }
};

const idpPresetCreationFailure = {
  createIDPPreset: null,
  errors: [
    {
      message: 'IDP Preset with the name `exists` already exists',
      path: ['createIDPPreset']
    }
  ]
};

const idpPresetDeletionSuccess = {
  deleteIDPPreset: {
    name: 'delete'
  }
};

const idpPresetDeletionFailure = {
  deleteIDPPreset: null,
  errors: [
    {
      message: 'Cannot find IDP Preset `doesntExist`',
      path: ['deleteIDPPreset']
    }
  ]
};

const idpPresetsQuery = {
  IDPPresets: [
    {
      name: 'test',
      issuer: 'test',
      jwksUri: 'https://test'
    },
    {
      name: 'test1',
      issuer: 'test1',
      jwksUri: 'https://test1'
    }
  ]
};

const graphlQLClientServiceMock = {
  request: (url = '', query, variables) => {
    switch (variables.name) {
      case 'test':
        return Observable.of(idpPresetCreationSuccess);
      case 'exists':
        return Observable.of(idpPresetCreationFailure);
      case 'delete':
        return Observable.of(idpPresetDeletionSuccess);
      case 'doesntExist':
        return Observable.of(idpPresetDeletionFailure);
      default:
        return Observable.of(idpPresetsQuery);
    }
  }
};

describe('IdpPresetsService', () => {
  let idpService: IdpPresetsService;
  let httpClientMock: HttpTestingController;
  let graphQLClientService: GraphQLClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IdpPresetsService,
        { provide: GraphQLClientService, useValue: graphlQLClientServiceMock }
      ]
    });

    idpService = TestBed.get(IdpPresetsService);
    graphQLClientService = TestBed.get(GraphQLClientService);
    httpClientMock = TestBed.get(HttpTestingController);
  });

  it('should create new IDP Preset', async () => {
    // given
    const dataToCreateIdpPreset = {
      name: 'test',
      issuer: 'https://issuer.com',
      jwksUri: 'https://jwks.com'
    };

    // when
    const observable = await idpService.createIdpPreset(dataToCreateIdpPreset);

    // then
    observable.subscribe(res => {
      expect(res['createIDPPreset'].name).toBe(
        idpPresetCreationSuccess.createIDPPreset.name
      );
    });
  });

  it('should throw an error because of existing IDP Preset', async () => {
    // given
    const dataToCreateIdpPreset = {
      name: 'exists',
      issuer: 'https://issuer.com',
      jwksUri: 'https://jwks.com'
    };

    // when
    const observable = await idpService.createIdpPreset(dataToCreateIdpPreset);

    // then
    observable.subscribe(res => {
      expect(res['createIDPPreset']).toBeNull();
      expect(res['errors'][0].message).toBe(
        idpPresetCreationFailure.errors[0].message
      );
    });
  });

  it('should delete IDP Preset', async () => {
    // given
    const idpNameToBeDeleted = 'delete';

    // when
    const observable = await idpService.deleteIdpPreset(idpNameToBeDeleted);

    // then
    observable.subscribe(res => {
      expect(res['deleteIDPPreset'].name).toBe(
        idpPresetDeletionSuccess.deleteIDPPreset.name
      );
    });
  });

  it(`shouldn't delete IDP Preset, because it doesn't exist`, async () => {
    // given
    const idpNameToBeDeleted = 'doesntExist';

    // when
    const observable = await idpService.deleteIdpPreset(idpNameToBeDeleted);

    // then
    observable.subscribe(res => {
      expect(res['deleteIDPPreset']).toBeNull();
      expect(res['errors'][0].message).toBe(
        idpPresetDeletionFailure.errors[0].message
      );
    });
  });

  it('should fetch all IDP Presets', async () => {
    // when
    const observable = await idpService.getIDPPresets();

    // then
    observable.subscribe(res => {
      expect(res['IDPPresets']).toBe(idpPresetsQuery.IDPPresets);
    });
  });
});
