{
  pkgs,
  config,
  lib,
  inputs,
  ...
}:
let

  pkgsUnstable = import inputs.nixpkgs-unstable {
    config.allowUnfree = true;
  };

  packages = with pkgs; [ ];

  packagesUnstable = with pkgsUnstable; [
    tailwindcss_4
  ];

  devPackages = with pkgs; [
    astro-language-server
    cacert
    caddy
    certbot-full
    direnv
    figlet
    git
    hello
    jq
    just
    nodePackages.postcss
    nodePackages.postcss-cli
    nodePackages.wrangler
    nss_latest
    toml-cli
    trivy
    worker-build
    yq-go
  ];
in
{
  name = "chatbot-frontend";

  env = {
    PROJECT = config.name;
  };

  cachix = {
    pull = [
      "pre-commit-hooks"
      "tresr-community"
    ];
    push = "tresr-community";
  };

  devenv = {
    warnOnNewVersion = true;
  };

  dotenv = {
    enable = true;
    disableHint = false;
  };

  packages =
    packages
    ++ packagesUnstable
    ++ lib.optionals (!config.container.isBuilding || config.name == "devenv") devPackages;

  enterShell = ''
    figlet -f starwars -w 180 $PROJECT

    hello --greeting="Hello ''${USER:-user}, welcome to the $PROJECT project!"

    echo ""
    echo "#########################"
    echo "#### Helper scripts #####"
    echo "#########################"
    echo "🦾"
    ${pkgs.gnused}/bin/sed -e 's| |••|g' -e 's|=| |' <<EOF | ${pkgs.util-linuxMinimal}/bin/column -t | ${pkgs.gnused}/bin/sed -e 's|^|🦾 |' -e 's|••| |g'
    ${lib.generators.toKeyValue { } (lib.mapAttrs (_name: value: value.description) config.scripts)}
    EOF
    echo "🦾"
    echo "#########################"
  '';

  languages = {
    nix = {
      enable = true;
    };
    shell = {
      enable = true;
    };
    javascript = {
      enable = true;
      bun = {
        enable = true;
      };
      npm = {
        enable = true;
      };
    };
  };

  difftastic = {
    enable = true;
  };

  git-hooks = {
    excludes = [
      ".direnv/"
      ".git/"
      ".vscode/"
      ".dist/"
      ".wrangler/"
    ];
    hooks = {
      actionlint.enable = true;
      check-json.enable = true;
      check-merge-conflicts.enable = true;
      check-shebang-scripts-are-executable.enable = true;
      check-symlinks.enable = true;
      check-yaml.enable = true;
      commitizen.enable = true;
      convco.enable = true;
      deadnix.enable = true;
      editorconfig-checker.enable = true;
      eslint.enable = false;
      eslint-hack = {
        enable = true;
        name = "eslint-hack";
        entry = "eslint-check";
        files = "^src/.*$";
        pass_filenames = false;
      };
      markdownlint = {
        enable = true;
        settings = {
          configuration = {
            MD013 = {
              line_length = 200;
            };
            MD033 = {
              allowed_elements = [
                "a"
                "br"
                "nobr"
                "pre"
                "sup"
              ];
            };
          };
        };
      };
      mixed-line-endings.enable = true;
      nixfmt-rfc-style.enable = true;
      pre-commit-hook-ensure-sops.enable = true;
      prettier = {
        enable = true;
        settings = {
          configPath = ".prettierrc.yaml";
        };
      };
      pretty-format-json = {
        enable = false;
      };
      revive = {
        enable = true;
        fail_fast = false;
      };
      ripsecrets = {
        enable = true;
      };
      shellcheck = {
        enable = true;
      };
      shfmt.enable = true;
      staticcheck.enable = true;
      statix.enable = true;
      trim-trailing-whitespace.enable = true;
      trufflehog.enable = true;
      typos.enable = true;
      yamllint = {
        enable = true;
        settings = {
          configuration = ''
            extends: relaxed
            rules:
              line-length: disable
              indentation: enable
          '';
        };
      };
    };
  };

  starship = {
    enable = true;
    config = {
      enable = false;
    };
  };

  devcontainer = {
    enable = true;
    settings = {
      customizations = {
        vscode = {
          extensions = [
            "arrterian.nix-env-selector"
            "esbenp.prettier-vscode"
            "github.vscode-github-actions"
            "gruntfuggly.todo-tree"
            "johnpapa.vscode-peacock"
            "mkhl.direnv"
            "nhoizey.gremlins"
            "pinage404.nix-extension-pack"
            "redhat.vscode-yaml"
            "streetsidesoftware.code-spell-checker"
            "tekumura.typos-vscode"
            "timonwong.shellcheck"
            "tuxtina.json2yaml"
            "vscodevim.vim"
            "wakatime.vscode-wakatime"
            "yzhang.markdown-all-in-one"
          ];
        };
      };
    };
  };

  scripts = {
    eslint-check = {
      package = pkgs.bash;
      description = "A workaround to use a more modern version of ESLint.";
      exec = ''
        bun install
        eslint src/
      '';
    };
  };

  enterTest = ''
    echo "Running devenv tests..."
  '';
}
