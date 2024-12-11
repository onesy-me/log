/* tslint:disable: no-shadowed-variable */
import { assert } from '@onesy/test';

import { evaluate } from '../utils/js/test/utils';

import OnesyLog from '../src';

group('OnesyLog', () => {

  pre(async () => {
    OnesyLog.options.log.enabled = false;
  });

  post(async () => {
    OnesyLog.options.log.enabled = true;
  });

  preEveryGroupTo(() => OnesyLog.reset());

  group('OnesyLog', () => {

    group('log', () => {

      to('archive', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          (window.OnesyLog.options.log.archive = true) && window.OnesyLog.info('a') && window.OnesyLog.archive.length,
          (window.OnesyLog.options.log.archive = false) && window.OnesyLog.info('a') && window.OnesyLog.archive.length,
        ]);

        const valueNode = [
          (OnesyLog.options.log.archive = true) && OnesyLog.info('a') && OnesyLog.archive.length,
          (OnesyLog.options.log.archive = false) && OnesyLog.info('a') && OnesyLog.archive.length,
        ];

        const values = [valueNode, ...valueBrowsers];

        values.forEach(value => assert(value).eql([
          1,
          false
        ]));
      });

      to('enabled', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          (window.OnesyLog.options.log.enabled = true) && new window.OnesyLog().info('a').logged,
          (window.OnesyLog.options.log.enabled = false) && new window.OnesyLog().info('a').logged,
        ]);

        const valueNode = [
          (OnesyLog.options.log.enabled = true) && new OnesyLog().info('a').logged,
          (OnesyLog.options.log.enabled = false) && new OnesyLog().info('a').logged,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          true,
          false
        ]));

        assert(valueNode).eql([
          true,
          false
        ]);

      });

      to('native', async () => {
        const valueBrowsers = await evaluate((window: any) => {
          const result = [];

          window.OnesyLog.options.log.native = true;

          result.push(new window.OnesyLog().info('a').method === console.info);

          window.OnesyLog.options.log.native = false;

          result.push(new window.OnesyLog().info('a').method === console.log);

          return result;
        });

        const result = [];

        OnesyLog.options.log.native = true;

        result.push(new OnesyLog().info('a').method === console.info);

        OnesyLog.options.log.native = false;

        result.push(new OnesyLog().info('a').method === console.log);

        const valueNode = result;

        valueBrowsers.forEach((value: any) => assert(value).eql([
          true,
          true
        ]));

        assert(valueNode).eql([
          true,
          true
        ]);
      });

      to('variants', async () => {
        OnesyLog.options.log.enabled = true;

        const valueBrowsers = await evaluate((window: any) => [
          (window.OnesyLog.options.log.variants = ['info']) && new window.OnesyLog().info('a').logged,
          (window.OnesyLog.options.log.variants = ['info']) && new window.OnesyLog().warn('a').logged,
        ]);

        const valueNode = [
          (OnesyLog.options.log.variants = ['info']) && new OnesyLog().info('a').logged,
          (OnesyLog.options.log.variants = ['info']) && new OnesyLog().warn('a').logged,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          true,
          false
        ]));

        assert(valueNode).eql([
          true,
          false
        ]);

        OnesyLog.options.log.enabled = false;
      });

      group('padding', () => {

        to('top', async () => {
          const valueBrowsers = await evaluate((window: any) => {
            return [
              (window.OnesyLog.options.log.padding.top = true) && window.OnesyLog.info('a').arguments,
              (window.OnesyLog.options.log.padding.top = false) || window.OnesyLog.info('a').arguments,
            ];
          });

          const valueNode = [
            (OnesyLog.options.log.padding.top = true) && OnesyLog.info('a').arguments,
            (OnesyLog.options.log.padding.top = false) || OnesyLog.info('a').arguments,
          ];

          valueBrowsers.forEach((value: any) => assert(value).eql([
            [
              `\n${value[0][0].slice(1, 24)} %c(info): `,
              'color: #1fc926',
              'a\n\n'
            ],
            [
              `${value[1][0].slice(0, 23)} %c(info): `,
              'color: #1fc926',
              'a\n\n'
            ],
          ]));

          assert(valueNode).eql([
            [
              `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
              'a\n'
            ],
            [
              `${valueNode[1][0].slice(0, 23)} \x1B[32m(info)\x1B[0m: `,
              'a\n'
            ],
          ]);
        });

        to('bottom', async () => {
          const valueBrowsers = await evaluate((window: any) => {
            return [
              (window.OnesyLog.options.log.padding.bottom = true) && window.OnesyLog.info('a').arguments,
              (window.OnesyLog.options.log.padding.bottom = false) || window.OnesyLog.info('a').arguments,
            ];
          });

          const valueNode = [
            (OnesyLog.options.log.padding.bottom = true) && OnesyLog.info('a').arguments,
            (OnesyLog.options.log.padding.bottom = false) || OnesyLog.info('a').arguments,
          ];

          valueBrowsers.forEach((value: any) => assert(value).eql([
            [
              `\n${value[0][0].slice(1, 24)} %c(info): `,
              'color: #1fc926',
              'a\n\n'
            ],
            [
              `\n${value[1][0].slice(1, 24)} %c(info): `,
              'color: #1fc926',
              'a'
            ],
          ]));

          assert(valueNode).eql([
            [
              `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
              'a\n'
            ],
            [
              `\n${valueNode[1][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
              'a'
            ],
          ]);
        });

      });

      group('variants', () => {

        to('all of the options', async () => {
          OnesyLog.variants.info.prefix = '/';
          OnesyLog.variants.info.sufix = '/';
          OnesyLog.variants.info.color = { browser: 'green', server: '34' };

          const valueBrowsers = await evaluate((window: any) => {
            window.OnesyLog.variants.info.prefix = '/';
            window.OnesyLog.variants.info.sufix = '/';
            window.OnesyLog.variants.info.color = { browser: 'green', server: '34' };

            return [
              window.OnesyLog.info('a').arguments,
            ];
          });

          const valueNode = [
            OnesyLog.info('a').arguments,
          ];

          valueBrowsers.forEach((value: any) => assert(value).eql([
            [
              `\n${value[0][0].slice(1, 24)} %c/info/: `,
              'color: green',
              'a\n\n'
            ],
          ]));

          assert(valueNode).eql([
            [
              `\n${valueNode[0][0].slice(1, 24)} \x1B[34m/info/\x1B[0m: `,
              'a\n'
            ],
          ]);
        });

        group('pre', () => {

          group('subscription', () => {

            to('log', async () => {
              const valueNode = [];

              OnesyLog.variants.log.pre.subscription.subscribe(value => valueNode.push(value));

              OnesyLog.log('log', 'a');

              const valueBrowsers = await evaluate((window: any) => {
                const values = [];

                window.OnesyLog.variants.log.pre.subscription.subscribe(value => values.push(value));

                window.OnesyLog.log('log', 'a');

                return values;
              });

              const values = [valueNode, ...valueBrowsers];

              values.forEach(value => assert(value).eql([
                'a',
              ]));
            });

            to('info', async () => {
              const valueNode = [];

              OnesyLog.variants.log.pre.subscription.subscribe(value => valueNode.push(value));

              OnesyLog.info('a');

              const valueBrowsers = await evaluate((window: any) => {
                const values = [];

                window.OnesyLog.variants.log.pre.subscription.subscribe(value => values.push(value));

                window.OnesyLog.info('a');

                return values;
              });

              const values = [valueNode, ...valueBrowsers];

              values.forEach(value => assert(value).eql([
                'a',
              ]));
            });

          });

        });

        group('post', () => {

          group('subscription', () => {

            to('log', async () => {
              const valueNode = [];

              OnesyLog.variants.log.post.subscription.subscribe(value => valueNode.push(value));

              OnesyLog.log('log', 'a');

              const valueBrowsers = await evaluate((window: any) => {
                const values = [];

                window.OnesyLog.variants.log.post.subscription.subscribe(value => values.push(value));

                window.OnesyLog.log('log', 'a');

                return values;
              });

              const values = [valueNode, ...valueBrowsers];

              values.forEach(value => assert(value).eql([
                'a',
              ]));
            });

            to('info', async () => {
              const valueNode = [];

              OnesyLog.variants.log.post.subscription.subscribe(value => valueNode.push(value));

              OnesyLog.info('a');

              const valueBrowsers = await evaluate((window: any) => {
                const values = [];

                window.OnesyLog.variants.log.post.subscription.subscribe(value => values.push(value));

                window.OnesyLog.info('a');

                return values;
              });

              const values = [valueNode, ...valueBrowsers];

              values.forEach(value => assert(value).eql([
                'a',
              ]));
            });

          });

        });

      });

      to('variantNames', async () => {
        const valueBrowsers = await evaluate((window: any) => window.OnesyLog.variantNames,);

        const valueNode = OnesyLog.variantNames;

        const values = [valueNode, ...valueBrowsers];

        values.forEach(value => assert(value).eql(['log', 'debug', 'info', 'warn', 'error', 'important']));
      });

      to('variantsDefault', async () => {
        const valueBrowsers = await evaluate((window: any) => window.OnesyLog.variantsDefault,);

        const valueNode = OnesyLog.variantsDefault;

        const values = [valueNode, ...valueBrowsers];

        values.forEach(value => assert(value).eql([
          { name: 'log', prefix: '(', sufix: ')', color: { browser: '#0b9fc3', server: '36' } },
          { name: 'debug', prefix: '(', sufix: ')', color: { browser: '#0b9fc3', server: '36' } },
          { name: 'info', prefix: '(', sufix: ')', color: { browser: '#1fc926', server: '32' } },
          { name: 'warn', prefix: '(', sufix: ')', color: { browser: '#a9b030', server: '33' } },
          { name: 'error', prefix: '(', sufix: ')', color: { browser: '#d74644', server: '31' } },
          { name: 'important', prefix: '(', sufix: ')', color: { browser: '#ca00c5', server: '35' } },
        ]));
      });

    });

    to('log', async () => {
      const valueBrowsers = await evaluate((window: any) => [
        window.OnesyLog.log('info', 'a').arguments,
      ]);

      const valueNode = [
        OnesyLog.log('info', 'a').arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          'a\n\n'
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          'a\n'
        ],
      ]);
    });

    to('debug', async () => {
      const valueBrowsers = await evaluate((window: any) => [
        window.OnesyLog.debug('a').arguments,
      ]);

      const valueNode = [
        OnesyLog.debug('a').arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(debug): `,
          'color: #0b9fc3',
          'a\n\n'
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[36m(debug)\x1B[0m: `,
          'a\n'
        ],
      ]);
    });

    to('info', async () => {
      const valueBrowsers = await evaluate((window: any) => [
        window.OnesyLog.info('a').arguments,
      ]);

      const valueNode = [
        OnesyLog.info('a').arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          'a\n\n'
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          'a\n'
        ],
      ]);
    });

    group('warn', () => {

      to('warn', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.OnesyLog.warn('a').arguments,
        ]);

        const valueNode = [
          OnesyLog.warn('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(warn): `,
            'color: #a9b030',
            'a'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[33m(warn)\x1B[0m: `,
            'a\n'
          ],
        ]);
      });

      to('More than 1 arguments', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.OnesyLog.warn('a', []).arguments,
        ]);

        const valueNode = [
          OnesyLog.warn('a', []).arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(warn): `,
            'color: #a9b030',
            '\n\na\n\n[]\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[33m(warn)\x1B[0m: `,
            '\n\na\n\n[]\n'
          ],
        ]);
      });

    });

    group('error', () => {

      to('error', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.OnesyLog.error('a').arguments,
        ]);

        const valueNode = [
          OnesyLog.error('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(error): `,
            'color: #d74644',
            'a'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[31m(error)\x1B[0m: `,
            'a\n'
          ],
        ]);
      });

      to('More than 1 arguments', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.OnesyLog.error('a', []).arguments,
        ]);

        const valueNode = [
          OnesyLog.error('a', []).arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(error): `,
            'color: #d74644',
            '\n\na\n\n[]\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[31m(error)\x1B[0m: `,
            '\n\na\n\n[]\n'
          ],
        ]);
      });

    });

    to('important', async () => {
      const valueBrowsers = await evaluate((window: any) => [
        window.OnesyLog.important('a').arguments,
      ]);

      const valueNode = [
        OnesyLog.important('a').arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(important): `,
          'color: #ca00c5',
          'a\n\n'
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[35m(important)\x1B[0m: `,
          'a\n'
        ],
      ]);
    });

    to('archiveClear', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        window.OnesyLog.options.log.archive = true;

        window.OnesyLog.info('a');

        const result = [
          window.OnesyLog.archive.length,
        ];

        window.OnesyLog.archiveClear();

        result.push(window.OnesyLog.archive.length);

        return result;
      });

      OnesyLog.options.log.archive = true;

      OnesyLog.info('a');

      const result = [
        OnesyLog.archive.length,
      ];

      OnesyLog.archiveClear();

      result.push(OnesyLog.archive.length);

      const valueNode = result;

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eql([
        1,
        0,
      ]));
    });

    to('reset', async () => {
      OnesyLog.options.log.variants = ['info'];

      const valueBrowsers = await evaluate((window: any) => {
        window.OnesyLog.options.log.variants = ['info'];

        window.OnesyLog.reset();

        return [
          window.OnesyLog.options,
          window.OnesyLog.variants,
        ];
      });

      const valueNode = [
        OnesyLog.options,
        OnesyLog.variants,
      ];

      const values = [valueNode, ...valueBrowsers];

      values.forEach((value: any) => {
        assert(value[0]).eql({
          log: {
            enabled: true,
            native: true,
            padding: {
              top: true,
              bottom: true
            },
            variants: [
              'info'
            ]
          },
        });

        assert(Object.keys(value[1])).eql(['log', 'debug', 'info', 'warn', 'error', 'important']);

        assert(value[1].info.pre).exist;
        assert(value[1].info.post).exist;

        delete value[1].info.pre;
        delete value[1].info.post;

        assert(value[1].info).eql({
          name: 'info',
          prefix: '(',
          sufix: ')',
          color: {
            browser: '#1fc926',
            server: '32'
          },
        });
      });
    });

    group('color', () => {

      to('color', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.OnesyLog.color('a', 'blue'),
          window.OnesyLog.color('a', 'green'),
          window.OnesyLog.color('a', 'orange'),
          window.OnesyLog.color('a', 'red'),
          window.OnesyLog.color('a', 'magenta'),
          window.OnesyLog.color('a', 'a'),
        ]);

        const valueNode = [
          OnesyLog.color('a', 'blue'),
          OnesyLog.color('a', 'green'),
          OnesyLog.color('a', 'orange'),
          OnesyLog.color('a', 'red'),
          OnesyLog.color('a', 'magenta'),
          OnesyLog.color('a', 'a'),
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          ['%ca', 'color: #0b9fc3'],
          ['%ca', 'color: #1fc926'],
          ['%ca', 'color: #a9b030'],
          ['%ca', 'color: #d74644'],
          ['%ca', 'color: #ca00c5'],
          ['%ca', 'color: #1fc926'],
        ]));
        assert(valueNode).eql([
          ['\x1B36ma\x1B[0m'],
          ['\x1B32ma\x1B[0m'],
          ['\x1B33ma\x1B[0m'],
          ['\x1B31ma\x1B[0m'],
          ['\x1B35ma\x1B[0m'],
          ['\x1B32ma\x1B[0m'],
        ]);
      });

      to('options', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.OnesyLog.color('a', 'a', { browser: 'orange', server: 'orange' }),
        ]);

        const valueNode = [
          OnesyLog.color('a', 'a', { browser: 'orange', server: 'orange' }),
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          ['%ca', 'color: orange'],
        ]));
        assert(valueNode).eql([
          ['\x1Borangema\x1B[0m'],
        ]);
      });

    });

  });

  group('onesylog', () => {

    group('log', () => {

      to('archive', async () => {
        const valueBrowsers = await evaluate((window: any) => {
          const onesylog = new window.OnesyLog({ log: { archive: true } });

          onesylog.info('a');

          onesylog.options.log.archive = false;

          onesylog.info('a');

          return [
            onesylog.archive.length,
          ];
        });

        const onesylog = new OnesyLog({ log: { archive: true } });

        onesylog.info('a');

        onesylog.options.log.archive = false;

        onesylog.info('a');

        const valueNode = [
          onesylog.archive.length,
        ];

        const values = [valueNode, ...valueBrowsers];

        values.forEach(value => assert(value).eql([
          1,
        ]));
      });

      to('enabled', async () => {
        OnesyLog.options.log.enabled = true;

        const valueBrowsers = await evaluate((window: any) => [
          new window.OnesyLog({
            log: {
              enabled: true,
            },
          }).info('a').logged,
          new window.OnesyLog({
            log: {
              enabled: false,
            },
          }).info('a').logged,
        ]);

        const valueNode = [
          new OnesyLog({
            log: {
              enabled: true,
            },
          }).info('a').logged,
          new OnesyLog({
            log: {
              enabled: false,
            },
          }).info('a').logged,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          true,
          false
        ]));

        assert(valueNode).eql([
          true,
          false
        ]);

        OnesyLog.options.log.enabled = false;
      });

      to('native', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          new window.OnesyLog({
            log: {
              native: true,
            },
          }).info('a').method === console.info,
          new window.OnesyLog({
            log: {
              native: false,
            },
          }).info('a').method === console.log,
        ]);

        const valueNode = [
          new OnesyLog({
            log: {
              native: true,
            },
          }).info('a').method === console.info,
          new OnesyLog({
            log: {
              native: false,
            },
          }).info('a').method === console.log,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          true,
          true
        ]));

        assert(valueNode).eql([
          true,
          true
        ]);
      });

      to('variants', async () => {
        OnesyLog.options.log.enabled = true;

        const valueBrowsers = await evaluate((window: any) => [
          new window.OnesyLog({
            log: {
              variants: ['info'],
            },
          }).info('a').logged,
          new window.OnesyLog({
            log: {
              variants: ['info'],
            },
          }).warn('a').logged,
        ]);

        const valueNode = [
          new OnesyLog({
            log: {
              variants: ['info'],
            },
          }).info('a').logged,
          new OnesyLog({
            log: {
              variants: ['info'],
            },
          }).warn('a').logged,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          true,
          false
        ]));

        assert(valueNode).eql([
          true,
          false
        ]);

        OnesyLog.options.log.enabled = false;
      });

      group('padding', () => {

        to('top', async () => {
          const valueBrowsers = await evaluate((window: any) => {
            return [
              new window.OnesyLog({ log: { padding: { top: true, bottom: true } } }).info('a').arguments,
              new window.OnesyLog({ log: { padding: { top: false, bottom: true } } }).info('a').arguments,
            ];
          });

          const valueNode = [
            new OnesyLog({ log: { padding: { top: true, bottom: true } } }).info('a').arguments,
            new OnesyLog({ log: { padding: { top: false, bottom: true } } }).info('a').arguments,
          ];

          valueBrowsers.forEach((value: any) => assert(value).eql([
            [
              `\n${value[0][0].slice(1, 24)} %c(info): `,
              'color: #1fc926',
              'a\n\n'
            ],
            [
              `${value[1][0].slice(0, 23)} %c(info): `,
              'color: #1fc926',
              'a\n\n'
            ],
          ]));

          assert(valueNode).eql([
            [
              `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
              'a\n'
            ],
            [
              `${valueNode[1][0].slice(0, 23)} \x1B[32m(info)\x1B[0m: `,
              'a\n'
            ],
          ]);
        });

        to('bottom', async () => {
          const valueBrowsers = await evaluate((window: any) => {
            return [
              new window.OnesyLog({ log: { padding: { top: true, bottom: true } } }).info('a').arguments,
              new window.OnesyLog({ log: { padding: { top: true, bottom: false } } }).info('a').arguments,
            ];
          });

          const valueNode = [
            new OnesyLog({ log: { padding: { top: true, bottom: true } } }).info('a').arguments,
            new OnesyLog({ log: { padding: { top: true, bottom: false } } }).info('a').arguments,
          ];

          valueBrowsers.forEach((value: any) => assert(value).eql([
            [
              `\n${value[0][0].slice(1, 24)} %c(info): `,
              'color: #1fc926',
              'a\n\n'
            ],
            [
              `\n${value[1][0].slice(1, 24)} %c(info): `,
              'color: #1fc926',
              'a'
            ],
          ]));

          assert(valueNode).eql([
            [
              `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
              'a\n'
            ],
            [
              `\n${valueNode[1][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
              'a'
            ],
          ]);
        });

      });

    });

    group('arguments', () => {

      to('all of the arguments', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          new window.OnesyLog({
            arguments: {
              pre: ['a'],
              post: ['a'],
            },
          }).info('a').arguments,
        ]);

        const valueNode = [
          new OnesyLog({
            arguments: {
              pre: ['a'],
              post: ['a'],
            },
          }).info('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `\n${value[0][0].slice(1, 24)} %c(info): `,
            'color: #1fc926',
            '\n\na\na\na\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
            '\n\na\na\na\n'
          ],
        ]);
      });

    });

    group('variants', () => {

      to('all of the options', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          new window.OnesyLog({
            variants: {
              info: { name: 'info', prefix: '/', sufix: '/', color: { browser: 'green', server: '34' } },
            },
          }).info('a').arguments,
        ]);

        const valueNode = [
          new OnesyLog({
            variants: {
              info: { name: 'info', prefix: '/', sufix: '/', color: { browser: 'green', server: '34' } },
            },
          }).info('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `\n${value[0][0].slice(1, 24)} %c/info/: `,
            'color: green',
            'a\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[34m/info/\x1B[0m: `,
            'a\n'
          ],
        ]);
      });

      group('pre', () => {

        group('subscription', () => {

          to('log', async () => {
            const valueNode = [];

            const onesylog = new OnesyLog();

            OnesyLog.variants.log.pre.subscription.subscribe(value => valueNode.push(value));

            onesylog.info('a');

            const valueBrowsers = await evaluate((window: any) => {
              const values = [];

              const onesylog = new window.OnesyLog();

              window.OnesyLog.variants.log.pre.subscription.subscribe(value => values.push(value));

              onesylog.info('a');

              return values;
            });

            const values = [valueNode, ...valueBrowsers];

            values.forEach(value => assert(value).eql([
              'a',
            ]));
          });

          to('info', async () => {
            const valueNode = [];

            const onesylog = new OnesyLog({
              variants: {
                info: { name: 'info', prefix: '/', sufix: '/', color: { browser: 'green', server: '34' } },
              },
            });

            OnesyLog.variants.log.pre.subscription.subscribe(value => valueNode.push(value));
            onesylog.variants.info.pre.subscription.subscribe(value => valueNode.push(value));

            onesylog.info('a');

            const valueBrowsers = await evaluate((window: any) => {
              const values = [];

              const onesylog = new window.OnesyLog({
                variants: {
                  info: { name: 'info', prefix: '/', sufix: '/', color: { browser: 'green', server: '34' } },
                },
              });

              window.OnesyLog.variants.log.pre.subscription.subscribe(value => values.push(value));
              onesylog.variants.info.pre.subscription.subscribe(value => values.push(value));

              onesylog.info('a');

              return values;
            });

            const values = [valueNode, ...valueBrowsers];

            values.forEach(value => assert(value).eql([
              'a',
              'a',
            ]));
          });

        });

      });

      group('post', () => {

        group('subscription', () => {

          to('log', async () => {
            const valueNode = [];

            const onesylog = new OnesyLog();

            OnesyLog.variants.log.post.subscription.subscribe(value => valueNode.push(value));

            onesylog.log('log', 'a');

            const valueBrowsers = await evaluate((window: any) => {
              const values = [];

              const onesylog = new window.OnesyLog();

              window.OnesyLog.variants.log.post.subscription.subscribe(value => values.push(value));

              onesylog.log('log', 'a');

              return values;
            });

            const values = [valueNode, ...valueBrowsers];

            values.forEach(value => assert(value).eql([
              'a',
            ]));
          });

          to('info', async () => {
            const valueNode = [];

            const onesylog = new OnesyLog({
              variants: {
                info: { name: 'info', prefix: '/', sufix: '/', color: { browser: 'green', server: '34' } },
              },
            });

            OnesyLog.variants.log.post.subscription.subscribe(value => valueNode.push(value));
            onesylog.variants.info.post.subscription.subscribe(value => valueNode.push(value));

            onesylog.info('a');

            const valueBrowsers = await evaluate((window: any) => {
              const values = [];

              const onesylog = new window.OnesyLog({
                variants: {
                  info: { name: 'info', prefix: '/', sufix: '/', color: { browser: 'green', server: '34' } },
                },
              });

              window.OnesyLog.variants.log.post.subscription.subscribe(value => values.push(value));
              onesylog.variants.info.post.subscription.subscribe(value => values.push(value));

              onesylog.info('a');

              return values;
            });

            const values = [valueNode, ...valueBrowsers];

            values.forEach(value => assert(value).eql([
              'a',
              'a',
            ]));
          });

        });

      });

    });

    group('date', () => {

      to('add', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          new window.OnesyLog({ date: { add: true } }).info('a').arguments,
          new window.OnesyLog({ date: { add: false } }).info('a').arguments,
        ]);

        const valueNode = [
          new OnesyLog({ date: { add: true } }).info('a').arguments,
          new OnesyLog({ date: { add: false } }).info('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `\n${value[0][0].slice(1, 24)} %c(info): `,
            'color: #1fc926',
            'a\n\n'
          ],
          [
            `\n%c(info): `,
            'color: #1fc926',
            'a\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
            'a\n'
          ],
          [
            `\n\x1B[32m(info)\x1B[0m: `,
            'a\n'
          ],
        ]);
      });

      to('method', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          new window.OnesyLog({ date: { method: () => 4 } }).info('a').arguments,
        ]);

        const valueNode = [
          new OnesyLog({ date: { method: () => 4 } }).info('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `\n4 %c(info): `,
            'color: #1fc926',
            'a\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n4 \x1B[32m(info)\x1B[0m: `,
            'a\n'
          ],
        ]);
      });

    });

    group('stringify', () => {

      to('method', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          new window.OnesyLog({ stringify: { method: () => 4 } }).info([1, 4]).arguments,
        ]);

        const valueNode = [
          new OnesyLog({ stringify: { method: () => 4 } }).info([1, 4]).arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `\n${value[0][0].slice(1, 24)} %c(info): `,
            'color: #1fc926',
            '\n\n4\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
            '\n\n4\n'
          ],
        ]);
      });

    });

    to('log', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        const error = new Error('a');

        error.stack = 'Error: a\n    at <anonymous>:1:24';

        return [
          window.OnesyLog.onesylog.log('info', 'a').arguments,
          window.OnesyLog.onesylog.log('info', [1, 3, 4]).arguments,
          window.OnesyLog.onesylog.log('info', 'a', 'a', 'a').arguments,
          window.OnesyLog.onesylog.log('info', 'a', 'a', 'a', [1, 3, 4], 'a').arguments,
          window.OnesyLog.onesylog.log('info', [1, 3, 4], 'a', [1, 3, 4]).arguments,
          window.OnesyLog.onesylog.log('info', [1, 3, 4], 'a', [1, 3, 4], 'a').arguments,
          window.OnesyLog.onesylog.log('info', [1, 3, 4], [1, { a: 4 }, 4], [1, 3, 4]).arguments,
          window.OnesyLog.onesylog.log('info', error).arguments,
        ];
      });

      const error = new Error('a');

      error.stack = 'Error: a\n    at <anonymous>:1:24';

      const valueNode = [
        OnesyLog.onesylog.log('info', 'a').arguments,
        OnesyLog.onesylog.log('info', [1, 3, 4]).arguments,
        OnesyLog.onesylog.log('info', 'a', 'a', 'a').arguments,
        OnesyLog.onesylog.log('info', 'a', 'a', 'a', [1, 3, 4], 'a').arguments,
        OnesyLog.onesylog.log('info', [1, 3, 4], 'a', [1, 3, 4]).arguments,
        OnesyLog.onesylog.log('info', [1, 3, 4], 'a', [1, 3, 4], 'a').arguments,
        OnesyLog.onesylog.log('info', [1, 3, 4], [1, { a: 4 }, 4], [1, 3, 4]).arguments,
        OnesyLog.onesylog.log('info', error).arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          'a\n\n'
        ],
        [
          `\n${value[1][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          '\n\n[\n  1,\n  3,\n  4\n]\n\n'
        ],
        [
          `\n${value[2][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          '\n\na\na\na\n\n'
        ],
        [
          `\n${value[3][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          '\n\na\na\na\n\n[\n  1,\n  3,\n  4\n]\n\na\n\n'
        ],
        [
          `\n${value[4][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          '\n\n[\n  1,\n  3,\n  4\n]\n\na\n\n[\n  1,\n  3,\n  4\n]\n\n'
        ],
        [
          `\n${value[5][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          '\n\n[\n  1,\n  3,\n  4\n]\n\na\n\n[\n  1,\n  3,\n  4\n]\n\na\n\n'
        ],
        [
          `\n${value[6][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          '\n\n[\n  1,\n  3,\n  4\n]\n\n[\n  1,\n  {\n    "a": 4\n  },\n  4\n]\n\n[\n  1,\n  3,\n  4\n]\n\n'
        ],
        [
          `\n${value[7][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          '\n\na\n\nError: a\n    at <anonymous>:1:24\n\n',
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          'a\n'
        ],
        [
          `\n${valueNode[1][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          '\n\n[\n  1,\n  3,\n  4\n]\n'
        ],
        [
          `\n${valueNode[2][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          '\n\na\na\na\n'
        ],
        [
          `\n${valueNode[3][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          '\n\na\na\na\n\n[\n  1,\n  3,\n  4\n]\n\na\n'
        ],
        [
          `\n${valueNode[4][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          '\n\n[\n  1,\n  3,\n  4\n]\n\na\n\n[\n  1,\n  3,\n  4\n]\n'
        ],
        [
          `\n${valueNode[5][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          '\n\n[\n  1,\n  3,\n  4\n]\n\na\n\n[\n  1,\n  3,\n  4\n]\n\na\n'
        ],
        [
          `\n${valueNode[6][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          '\n\n[\n  1,\n  3,\n  4\n]\n\n[\n  1,\n  {\n    "a": 4\n  },\n  4\n]\n\n[\n  1,\n  3,\n  4\n]\n'
        ],
        [
          `\n${valueNode[7][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          '\n\na\n\nError: a\n    at <anonymous>:1:24\n',
        ],
      ]);
    });

    to('debug', async () => {
      const valueBrowsers = await evaluate((window: any) => [
        window.OnesyLog.onesylog.debug('a').arguments,
      ]);

      const valueNode = [
        OnesyLog.onesylog.debug('a').arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(debug): `,
          'color: #0b9fc3',
          'a\n\n'
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[36m(debug)\x1B[0m: `,
          'a\n'
        ],
      ]);
    });

    to('info', async () => {
      const valueBrowsers = await evaluate((window: any) => [
        window.OnesyLog.onesylog.info('a').arguments,
      ]);

      const valueNode = [
        OnesyLog.onesylog.info('a').arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          'a\n\n'
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          'a\n'
        ],
      ]);

    });

    group('warn', () => {

      to('warn', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.OnesyLog.onesylog.warn('a').arguments,
        ]);

        const valueNode = [
          OnesyLog.onesylog.warn('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(warn): `,
            'color: #a9b030',
            'a'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[33m(warn)\x1B[0m: `,
            'a\n'
          ],
        ]);
      });

      to('More than 1 arguments', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.OnesyLog.onesylog.warn('a', []).arguments,
        ]);

        const valueNode = [
          OnesyLog.onesylog.warn('a', []).arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(warn): `,
            'color: #a9b030',
            '\n\na\n\n[]\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[33m(warn)\x1B[0m: `,
            '\n\na\n\n[]\n'
          ],
        ]);
      });

    });

    group('error', () => {

      to('error', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.OnesyLog.onesylog.error('a').arguments,
        ]);

        const valueNode = [
          OnesyLog.onesylog.error('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(error): `,
            'color: #d74644',
            'a'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[31m(error)\x1B[0m: `,
            'a\n'
          ],
        ]);
      });

      to('More than 1 arguments', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.OnesyLog.onesylog.error('a', []).arguments,
        ]);

        const valueNode = [
          OnesyLog.onesylog.error('a', []).arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(error): `,
            'color: #d74644',
            '\n\na\n\n[]\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[31m(error)\x1B[0m: `,
            '\n\na\n\n[]\n'
          ],
        ]);
      });

    });

    to('important', async () => {
      const valueBrowsers = await evaluate((window: any) => [
        window.OnesyLog.onesylog.important('a').arguments,
      ]);

      const valueNode = [
        OnesyLog.onesylog.important('a').arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(important): `,
          'color: #ca00c5',
          'a\n\n'
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[35m(important)\x1B[0m: `,
          'a\n'
        ],
      ]);
    });

    to('archiveClear', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        const onesylog = new window.OnesyLog({ log: { archive: true } });

        onesylog.info('a');

        const result = [
          onesylog.archive.length,
        ];

        onesylog.archiveClear();

        result.push(onesylog.archive.length);

        return result;
      });

      const onesylog = new OnesyLog({ log: { archive: true } });

      onesylog.info('a');

      const result = [
        onesylog.archive.length,
      ];

      onesylog.archiveClear();

      result.push(onesylog.archive.length);

      const valueNode = result;

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eql([
        1,
        0,
      ]));
    });

  });

});
