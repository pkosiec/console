import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleBindingModalComponent } from './role-binding-modal.component';
import { Observable } from 'rxjs/Observable';
import { ComponentCommunicationService } from '../../services/component-communication.service';
import { RbacService } from '../../services/rbac.service';
import { CurrentEnvironmentService } from '../../../content/environments/services/current-environment.service';
import { FormsModule } from '@angular/forms';

const RbacServiceMock = {
  getClusterRoles() {
    return Observable.of({});
  },
  getRoles() {
    return Observable.of({});
  },
  createClusterRoleBinding() {
    return Observable.of({});
  },
  createRoleBinding() {
    return Observable.of({});
  }
};

const CurrentEnvironmentServiceMock = {
  getCurrentEnvironmentId() {
    return Observable.of('currentId');
  }
};

describe('RoleBindingModalComponent', () => {
  let component: RoleBindingModalComponent;
  let fixture: ComponentFixture<RoleBindingModalComponent>;
  let RbacServiceMockStub: RbacService;
  let CurrentEnvironmentServiceMockStub: CurrentEnvironmentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        {
          provide: RbacService,
          useValue: RbacServiceMock
        },
        {
          provide: CurrentEnvironmentService,
          useValue: CurrentEnvironmentServiceMock
        },
        ComponentCommunicationService
      ],
      declarations: [RoleBindingModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleBindingModalComponent);
    component = fixture.componentInstance;
    RbacServiceMockStub = fixture.debugElement.injector.get(RbacService);
    CurrentEnvironmentServiceMockStub = fixture.debugElement.injector.get(
      CurrentEnvironmentService
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    // then
    expect(component).toBeTruthy();
    expect(component.isActive).toBeFalsy();
    expect(component.roles).toEqual([]);
    expect(component.filteredRoles).toEqual([]);
  });

  it('should get the list of cluster roles', async () => {
    // given
    const clusterRoles = Observable.of({
      items: [
        {
          metadata: {
            name: 'user1'
          }
        },
        {
          metadata: {
            name: 'user2'
          }
        }
      ]
    });
    component.isReadyToCreate();

    const spyGetClusterRoles = spyOn(
      RbacServiceMockStub,
      'getClusterRoles'
    ).and.returnValue(clusterRoles);
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    await component.getClusterRoles();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyGetClusterRoles.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(RbacServiceMockStub.getClusterRoles).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();
      expect(component.roles).toEqual(['user1', 'user2']);
      expect(component.filteredRoles).toEqual(['user1', 'user2']);
    });
  });

  it('should not fail if gets wrong data', async () => {
    // given
    const clusterRoles = Observable.of({
      items: ''
    });
    component.isReadyToCreate();

    const spyGetClusterRoles = spyOn(
      RbacServiceMockStub,
      'getClusterRoles'
    ).and.returnValue(clusterRoles);
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    await component.getClusterRoles();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyGetClusterRoles.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(RbacServiceMockStub.getClusterRoles).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();
      expect(component.roles).toEqual([]);
      expect(component.filteredRoles).toEqual([]);
    });
  });

  it('should catch an error', async () => {
    // given
    const clusterRoles = Observable.throw('Error');
    component.isReadyToCreate();

    const spyClusterRoles = spyOn(
      RbacServiceMockStub,
      'getClusterRoles'
    ).and.returnValue(clusterRoles);
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    await component.getClusterRoles();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyClusterRoles.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeTruthy();
      expect(RbacServiceMockStub.getClusterRoles).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(component.roles).toEqual([]);
      expect(component.filteredRoles).toEqual([]);
    });
  });

  it('should get the list of roles', async () => {
    // given
    const roles = Observable.of({
      items: [
        {
          metadata: {
            name: 'user1'
          }
        },
        {
          metadata: {
            name: 'user2'
          }
        }
      ]
    });
    component.isReadyToCreate();

    const spyGetRoles = spyOn(RbacServiceMockStub, 'getRoles').and.returnValue(
      roles
    );
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    await component.getRoles();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyGetRoles.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(RbacServiceMockStub.getRoles).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();
      expect(component.roles).toEqual(['user1', 'user2']);
      expect(component.filteredRoles).toEqual(['user1', 'user2']);
    });
  });

  it('should not fail if gets wrong data', async () => {
    // given
    const roles = Observable.of({
      items: ''
    });
    component.isReadyToCreate();

    const spyGetRoles = spyOn(RbacServiceMockStub, 'getRoles').and.returnValue(
      roles
    );
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    await component.getRoles();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyGetRoles.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(RbacServiceMockStub.getRoles).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();
      expect(component.roles).toEqual([]);
      expect(component.filteredRoles).toEqual([]);
    });
  });

  it('should catch an error', async () => {
    // given
    const roles = Observable.throw('Error');
    component.isReadyToCreate();

    const spyGetRoles = spyOn(RbacServiceMockStub, 'getRoles').and.returnValue(
      roles
    );
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    await component.getRoles();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyGetRoles.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeTruthy();
      expect(RbacServiceMockStub.getRoles).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(component.roles).toEqual([]);
      expect(component.filteredRoles).toEqual([]);
    });
  });

  it('should react on Save event with Role, on Permissions view', async () => {
    // given
    const roles = Observable.of({
      items: [
        {
          metadata: {
            name: 'user1'
          }
        },
        {
          metadata: {
            name: 'user2'
          }
        }
      ]
    });
    component.isActive = true;
    component.isGlobalPermissionsView = false;
    component.userGroup = 'group';
    component.isReadyToCreate();

    const spyGetRoles = spyOn(RbacServiceMockStub, 'getRoles').and.returnValue(
      roles
    );
    const spyCreateRoleBinding = spyOn(
      RbacServiceMockStub,
      'createRoleBinding'
    ).and.returnValue(Observable.of({ data: 'created' }));
    const spyConsoleLog = spyOn(console, 'log');

    // when
    component.selectKind('Role');
    component.selectRole('user1');
    fixture.detectChanges();
    await component.save();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(component.isActive).toBeFalsy();
      expect(component.isGlobalPermissionsView).toBeFalsy();
      expect(spyGetRoles.calls.any()).toBeTruthy();
      expect(spyCreateRoleBinding.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(RbacServiceMockStub.getRoles).toHaveBeenCalledTimes(1);
      expect(RbacServiceMockStub.createRoleBinding).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  it('should react on Save event with ClusterRole, on GlobalPermissions view', async () => {
    // given
    const clusterRoles = Observable.of({
      items: [
        {
          metadata: {
            name: 'user1'
          }
        },
        {
          metadata: {
            name: 'user2'
          }
        }
      ]
    });
    component.isActive = true;
    component.isGlobalPermissionsView = true;
    component.userGroup = 'group';
    component.isReadyToCreate();

    const spyGetClusterRoles = spyOn(
      RbacServiceMockStub,
      'getClusterRoles'
    ).and.returnValue(clusterRoles);
    const spyCreateClusterRoleBinding = spyOn(
      RbacServiceMockStub,
      'createClusterRoleBinding'
    ).and.returnValue(Observable.of({ data: 'created' }));
    const spyConsoleLog = spyOn(console, 'log');

    // when
    component.selectKind('ClusterRole');
    component.selectRole('user1');
    fixture.detectChanges();
    await component.save();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(component.isActive).toBeFalsy();
      expect(component.isGlobalPermissionsView).toBeTruthy();
      expect(spyGetClusterRoles.calls.any()).toBeTruthy();
      expect(spyCreateClusterRoleBinding.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(RbacServiceMockStub.getClusterRoles).toHaveBeenCalledTimes(1);
      expect(
        RbacServiceMockStub.createClusterRoleBinding
      ).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();
    });
  });
});
