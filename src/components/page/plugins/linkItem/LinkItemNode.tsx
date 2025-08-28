/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { JSX } from 'react';

import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';
import {
  DOMConversionMap,
  DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type ElementFormatType,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type Spread,
} from 'lexical';

import { LinkItemComponent } from './LinkItemComponent';

export type SerializedLinkItemNode = Spread<
  {
    url: string;
    layout: Layout;
    type: 'linkItem';
    version: 1;
  },
  SerializedDecoratorBlockNode
>;

export type Layout = 'iframe' | 'button' | 'text';

function $convertLinkItemElement(
  domNode: HTMLDivElement,
): DOMConversionOutput | null {
  const layout: Layout =
    (domNode.getAttribute('data-lexical-link-item-layout') as Layout) ?? 'text';
  if (layout) {
    const node = $createLinkItemNode({
      layout: layout,
      url: domNode.getAttribute('href') ?? '',
    });
    return { node };
  }
  return null;
}

export class LinkItemNode extends DecoratorBlockNode {
  __id: string;
  __url: string;
  __layout: Layout;

  static getType(): string {
    return 'linkItem';
  }

  static clone(node: LinkItemNode): LinkItemNode {
    return new LinkItemNode(
      node.__url,
      node.__layout,
      node.__format,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedLinkItemNode): LinkItemNode {
    const node = $createLinkItemNode({
      url: serializedNode.url,
      layout: serializedNode.layout,
    });
    node.setFormat(serializedNode.format);
    return node;
  }

  // cannot use object in first parameter because of collab
  constructor(
    url: string,
    layout?: Layout,
    format?: ElementFormatType,
    key?: NodeKey,
  ) {
    super(format, key);
    this.__url = url;
    this.__layout = layout ?? 'iframe';
  }

  static importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      a: () => {
        return {
          conversion: $convertLinkItemElement,
          priority: 2,
        };
      },
    };
  }

  getLayout(): Layout {
    return this.__layout;
  }

  getUrl(): string {
    return this.__url;
  }

  exportJSON(): SerializedLinkItemNode {
    return {
      ...super.exportJSON(),
      type: 'linkItem',
      version: 1,
      url: this.getUrl(),
      layout: this.getLayout(),
    };
  }
  exportDOM(): DOMExportOutput {
    const element = document.createElement('a');
    element.setAttribute('href', this.__url);
    element.setAttribute('data-lexical-link-item-layout', this.__layout);
    return { element };
  }

  changeLayout(editor: LexicalEditor) {
    return (layout: Layout) => {
      editor.update(() => {
        const writable = this.getWritable();
        writable.__layout = layout;
      });
    };
  }

  changeUrl(editor: LexicalEditor) {
    return (url: string) => {
      editor.update(() => {
        const writable = this.getWritable();
        writable.__url = url;
      });
    };
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    };

    return (
      <LinkItemComponent
        className={className}
        format={this.__format}
        loadingComponent="Loading..."
        nodeKey={this.getKey()}
        url={this.__url}
        layout={this.__layout}
        onLayoutChange={this.changeLayout(editor)}
        onUrlChange={this.changeUrl(editor)}
        canEdit={editor.isEditable()}
      />
    );
  }
}

export function $createLinkItemNode(params: {
  url: string;
  layout: Layout;
}): LinkItemNode {
  return new LinkItemNode(params.url, params.layout);
}

export function $isLinkItemNode(
  node: LinkItemNode | LexicalNode | null | undefined,
): node is LinkItemNode {
  return node instanceof LinkItemNode;
}
