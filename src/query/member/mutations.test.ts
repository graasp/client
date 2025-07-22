import {
  CompleteMember,
  HttpMethod,
  MemberFactory,
  ThumbnailSize,
} from '@graasp/sdk';

import { act } from '@testing-library/react';
import { StatusCodes } from 'http-status-codes';
import nock from 'nock';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { axiosClient as axios } from '@/query/api/axios.js';

import { memberKeys } from '../keys.js';
import { OK_RESPONSE, UNAUTHORIZED_RESPONSE } from '../test/constants.js';
import { mockMutation, setUpTest, waitForMutation } from '../test/utils.js';
import {
  buildDeleteCurrentMemberRoute,
  buildPatchCurrentMemberRoute,
  buildUploadAvatarRoute,
} from './routes.js';
import { uploadAvatarRoutine } from './routines.js';

const mockedNotifier = vi.fn();
const { wrapper, queryClient, mutations } = setUpTest({
  notifier: mockedNotifier,
});
describe('Member Mutations', () => {
  afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    nock.cleanAll();
  });

  describe('useDeleteCurrentMember', () => {
    const mutation = mutations.useDeleteCurrentMember;

    it(`Successfully delete member`, async () => {
      const endpoints = [
        {
          route: `/${buildDeleteCurrentMemberRoute()}`,
          method: HttpMethod.Delete,
          response: OK_RESPONSE,
        },
        {
          route: '/logout',
          response: OK_RESPONSE,
        },
      ];
      // set random data in cache
      queryClient.setQueryData(memberKeys.current().content, MemberFactory());

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate();
        await waitForMutation(2000);
      });

      // verify cache keys
      expect(queryClient.getQueryData(memberKeys.current().content)).toEqual(
        undefined,
      );
    });

    it(`Unauthorized`, async () => {
      // set random data in cache
      const member = MemberFactory();
      queryClient.setQueryData(memberKeys.current().content, member);
      const endpoints = [
        {
          method: HttpMethod.Delete,
          response: UNAUTHORIZED_RESPONSE,
          statusCode: StatusCodes.UNAUTHORIZED,
          route: `/${buildDeleteCurrentMemberRoute()}`,
        },
      ];
      const mockedMutation = await mockMutation({
        mutation,
        endpoints,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate();
        await waitForMutation();
      });

      // verify cache keys
      expect(
        queryClient.getQueryData(memberKeys.current().content),
      ).toMatchObject(member);
    });
  });

  describe('useEditCurrentMember', () => {
    const member = MemberFactory();
    const route = `/${buildPatchCurrentMemberRoute()}`;
    const newMember = { name: 'newname' };
    const mutation = mutations.useEditCurrentMember;

    it(`Successfully edit member id = ${member.id}`, async () => {
      const response = { ...member, name: newMember.name };
      // set random data in cache
      queryClient.setQueryData(memberKeys.current().content, member);
      const endpoints = [
        {
          response,
          method: HttpMethod.Patch,
          route,
        },
      ];
      const patchSpy = vi.spyOn(axios, 'patch');
      const mockedMutation = await mockMutation({
        mutation,
        wrapper,
        endpoints,
      });

      await act(async () => {
        mockedMutation.mutate(newMember);
        await waitForMutation();
      });

      expect(patchSpy).toHaveBeenCalledWith(expect.anything(), newMember);

      // verify cache keys
      const newData = queryClient.getQueryState(memberKeys.current().content);
      expect(newData?.isInvalidated).toBeTruthy();
    });

    it(`Successfully edit member's username and ensures trimming`, async () => {
      const newUsernameWithTrailingSpace = 'newname  ';
      const trimmedUsername = newUsernameWithTrailingSpace.trim();
      const response = { ...member, name: trimmedUsername };
      // set random data in cache
      queryClient.setQueryData(memberKeys.current().content, member);
      const endpoints = [
        {
          response,
          method: HttpMethod.Patch,
          route,
        },
      ];
      const patchSpy = vi.spyOn(axios, 'patch');
      const mockedMutation = await mockMutation({
        mutation,
        wrapper,
        endpoints,
      });

      await act(async () => {
        mockedMutation.mutate({
          name: newUsernameWithTrailingSpace,
        });
        await waitForMutation();
      });
      const payload = patchSpy.mock.calls[0][1] as { name?: string };

      // Assert that the name sent to the API is trimmed
      expect(payload.name).toEqual(trimmedUsername);

      // verify cache keys
      const newData = queryClient.getQueryState(memberKeys.current().content);
      expect(newData?.isInvalidated).toBeTruthy();
    });

    it(`Successfully enable saveActions`, async () => {
      const enableSaveActions = true;
      const updateMember = { enableSaveActions };
      const response = { ...member, ...updateMember };
      // set random data in cache
      queryClient.setQueryData(memberKeys.current().content, member);
      const endpoints = [
        {
          response,
          method: HttpMethod.Patch,
          route,
        },
      ];
      const patchSpy = vi.spyOn(axios, 'patch');
      const mockedMutation = await mockMutation({
        mutation,
        wrapper,
        endpoints,
      });

      await act(async () => {
        mockedMutation.mutate(updateMember);
        await waitForMutation();
      });

      expect(patchSpy).toHaveBeenCalledWith(expect.anything(), updateMember);

      // verify cache keys
      const newData = queryClient.getQueryData<CompleteMember>(
        memberKeys.current().content,
      );
      expect(newData).toMatchObject(response);
    });

    it(`Unauthorized`, async () => {
      // set random data in cache
      queryClient.setQueryData(memberKeys.current().content, member);
      const endpoints = [
        {
          response: UNAUTHORIZED_RESPONSE,
          statusCode: StatusCodes.UNAUTHORIZED,
          method: HttpMethod.Patch,
          route,
        },
      ];
      const mockedMutation = await mockMutation({
        mutation,
        wrapper,
        endpoints,
      });

      await act(async () => {
        mockedMutation.mutate(newMember);
        await waitForMutation();
      });

      // verify cache keys
      const oldData = queryClient.getQueryData<CompleteMember>(
        memberKeys.current().content,
      );
      expect(oldData).toMatchObject(member);
    });
  });

  describe('useUploadAvatar', () => {
    const mutation = mutations.useUploadAvatar;
    const member = MemberFactory();
    const replyUrl = true;
    const { id } = member;
    const file = new Blob();

    it('Upload avatar', async () => {
      const route = `/${buildUploadAvatarRoute()}`;

      // set data in cache for current member (necessary for query invalidation)
      queryClient.setQueryData(memberKeys.current().content, member);
      // set query in cache for thumbnail from currentMember
      Object.values(ThumbnailSize).forEach((size) => {
        const key = memberKeys.single(id).avatar({ size, replyUrl });
        queryClient.setQueryData(key, 'thumbnail');
      });

      const endpoints = [
        {
          statusCode: StatusCodes.NO_CONTENT,
          method: HttpMethod.Post,
          route,
          response: {},
        },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({ file });
        await waitForMutation();
      });

      for (const size of Object.values(ThumbnailSize)) {
        const key = memberKeys.single(id).avatar({ size, replyUrl: true });
        const state = queryClient.getQueryState(key);
        expect(state?.isInvalidated).toBeTruthy();
      }
      expect(mockedNotifier).toHaveBeenCalledWith({
        type: uploadAvatarRoutine.SUCCESS,
        payload: { message: 'UPLOAD_AVATAR' },
      });
    });

    it('Unauthorized to upload an avatar', async () => {
      const route = `/${buildUploadAvatarRoute()}`;
      // set data in cache for current member (necessary for query invalidation)
      queryClient.setQueryData(memberKeys.current().content, member);
      Object.values(ThumbnailSize).forEach((size) => {
        const key = memberKeys.single(id).avatar({ size, replyUrl });
        queryClient.setQueryData(key, 'thumbnail');
      });

      const response = UNAUTHORIZED_RESPONSE;

      const endpoints = [
        {
          response,
          statusCode: StatusCodes.UNAUTHORIZED,
          method: HttpMethod.Post,
          route,
        },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({ file });
        await waitForMutation();
      });

      for (const size of Object.values(ThumbnailSize)) {
        const key = memberKeys.single(id).avatar({ size, replyUrl });
        const state = queryClient.getQueryState(key);
        expect(state?.isInvalidated).toBeFalsy();
      }

      expect(mockedNotifier).toHaveBeenCalledWith(
        expect.objectContaining({ type: uploadAvatarRoutine.FAILURE }),
      );
    });
  });
});
