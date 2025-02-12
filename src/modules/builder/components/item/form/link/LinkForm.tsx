import { type JSX, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import {
  DescriptionPlacementType,
  DiscriminatedItem,
  ItemGeolocation,
  ItemType,
  UnionOfConst,
  buildLinkExtra,
  getLinkThumbnailUrl,
} from '@graasp/sdk';

import { NS } from '@/config/constants';
import { hooks, mutations } from '@/config/queryClient';
import { ITEM_FORM_CONFIRM_BUTTON_ID } from '@/config/selectors';
import LinkCard from '@/ui/Card/LinkCard';
import Button from '@/ui/buttons/Button/Button';
import LinkItem from '@/ui/items/LinkItem';

import CancelButton from '~builder/components/common/CancelButton';

import { BUILDER } from '../../../../langs';
import { isUrlValid } from '../../../../utils/item';
import { ItemNameField } from '../ItemNameField';
import { DescriptionAndPlacementForm } from '../description/DescriptionAndPlacementForm';
import LinkUrlField from './LinkUrlField';
import { LinkType, getSettingsFromLinkType, normalizeURL } from './linkUtils';

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  // remove weird default margins on label
  margin: 0,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  // this allows to apply a style to the current element if if contains an input element that is checked
  '&:has(input:checked)': {
    // here we added a bit of opacity to the color used on the background of the icons cards
    backgroundColor: '#E4DFFFB3',
  },
}));

const StyledDiv = styled('div')(() => ({
  '& > div': {
    height: '200px !important',
    paddingBottom: '0 !important',
  },
}));

type Props = {
  onClose: () => void;
  parentId?: DiscriminatedItem['id'];
  geolocation?: Pick<ItemGeolocation, 'lat' | 'lng'>;
  previousItemId?: DiscriminatedItem['id'];
};

type Inputs = {
  name: string;
  linkType: UnionOfConst<typeof LinkType>;
  description: string;
  descriptionPlacement: DescriptionPlacementType;
  url: string;
};

export const LinkForm = ({
  onClose,
  parentId,
  geolocation,
  previousItemId,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { t: translateCommon } = useTranslation(NS.Common);
  const { mutateAsync: createItem } = mutations.usePostItem();
  const methods = useForm<Inputs>();
  const {
    setValue,
    watch,
    handleSubmit,
    control,
    getValues,
    formState: { isValid, isSubmitted },
  } = methods;

  const description = watch('description');
  const url = watch('url');
  const isValidUrl = isUrlValid(normalizeURL(url));
  const { data: linkData } = hooks.useLinkMetadata(
    isValidUrl ? normalizeURL(url) : '',
  );

  // apply the description from the api to the field
  // this is only run once.
  useEffect(
    () => {
      const { name } = getValues();
      if (!description && linkData?.description) {
        setValue('description', linkData.description);
      }
      if (!name && linkData?.title) {
        setValue('name', linkData.title);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [linkData],
  );

  async function onSubmit(data: Inputs) {
    try {
      await createItem({
        name: data.name,
        type: ItemType.LINK,
        description: data.description,
        extra: buildLinkExtra({
          url: normalizeURL(data.url),
          description: linkData?.description,
          thumbnails: linkData?.thumbnails,
          icons: linkData?.icons,
        }),
        settings: {
          descriptionPlacement: data.descriptionPlacement,
          ...getSettingsFromLinkType(data.linkType),
        },
        parentId,
        geolocation,
        previousItemId,
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  const embeddedLinkPreview = useMemo(
    () => (
      <LinkItem
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        item={{
          type: ItemType.LINK,
          settings: {},
          extra: { [ItemType.LINK]: { url: normalizeURL(url) } },
        }}
        showIframe
        showButton={false}
        height="200px"
      />
    ),
    [url],
  );

  const thumbnail = linkData
    ? getLinkThumbnailUrl(buildLinkExtra({ ...linkData, url }))
    : undefined;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>
        {translateBuilder(BUILDER.CREATE_ITEM_LINK_TITLE)}
      </DialogTitle>
      <FormProvider {...methods}>
        <DialogContent>
          <Stack gap={1} overflow="scroll">
            <LinkUrlField />
            <ItemNameField
              required
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={false}
            />
            <DescriptionAndPlacementForm />
            {isValidUrl && (
              <FormControl>
                <Typography variant="caption">
                  {translateBuilder(BUILDER.CREATE_ITEM_LINK_TYPE_TITLE)}
                </Typography>
                {url ? (
                  <Controller
                    control={control}
                    defaultValue={LinkType.Default}
                    name="linkType"
                    render={({ field }) => (
                      <RadioGroup sx={{ display: 'flex', gap: 2 }} {...field}>
                        <StyledFormControlLabel
                          value={LinkType.Default}
                          label={<Link href={url}>{url}</Link>}
                          control={<Radio />}
                        />
                        <StyledFormControlLabel
                          value={LinkType.Fancy}
                          label={
                            <LinkCard
                              title={linkData?.title ?? ''}
                              url={url}
                              thumbnail={thumbnail}
                              description={description || ''}
                            />
                          }
                          control={<Radio />}
                          slotProps={{
                            typography: { width: '100%', minWidth: '0px' },
                          }}
                          sx={{ minWidth: '0px', width: '100%' }}
                        />
                        {linkData?.html && linkData.html !== '' && (
                          <StyledFormControlLabel
                            value={LinkType.Embedded}
                            label={
                              <StyledDiv
                                sx={{}}
                                dangerouslySetInnerHTML={{
                                  __html: linkData.html,
                                }}
                              />
                            }
                            control={<Radio />}
                            slotProps={{
                              typography: {
                                width: '100%',
                                minWidth: '0px',
                              },
                            }}
                          />
                        )}
                        {
                          // only show this options when embedding is allowed and there is no html code
                          // as the html will take precedence over showing the site as an iframe
                          // and some sites like daily motion actually allow both, we want to allow show the html setting
                          linkData?.isEmbeddingAllowed && !linkData?.html && (
                            <StyledFormControlLabel
                              value={LinkType.Embedded}
                              label={embeddedLinkPreview}
                              control={<Radio />}
                              slotProps={{
                                typography: {
                                  width: '100%',
                                  minWidth: '0px',
                                },
                              }}
                              sx={{
                                // this ensure the iframe takes up all horizontal space
                                '& iframe': {
                                  width: '100%',
                                },
                              }}
                            />
                          )
                        }
                      </RadioGroup>
                    )}
                  />
                ) : (
                  <Typography fontStyle="italic">
                    {translateBuilder(
                      BUILDER.CREATE_ITEM_LINK_TYPE_HELPER_TEXT,
                    )}
                  </Typography>
                )}
              </FormControl>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={onClose} />
          <Button
            id={ITEM_FORM_CONFIRM_BUTTON_ID}
            type="submit"
            disabled={isSubmitted && !isValid}
          >
            {translateCommon('SAVE.BUTTON_TEXT')}
          </Button>
        </DialogActions>
      </FormProvider>
    </Box>
  );
};
