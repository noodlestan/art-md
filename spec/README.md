# Artificial Language Module

## Purpose

This module defines the artificial language used to describe and generate context resources. It provides the foundational vocabulary, syntax, and semantics for declaring structured context value types — think: data primitives and "classes".

## Publishable Content

The publishable content lives in `grammar/` and covers:

- **Vocabulary** — the standardized terms used to describe artificial language constructs and their interpretation.
- **Semantics** — the meaning and interpretation rules of artificial instructions.
- **Structures** — the meta-model describing grammar constructs.
- **Constructs** — the concrete language constructs, grouped by category (context, expressions, inline, structural).

## Work in Progress

Placeholder construct stubs, drafted pseudo-art content (primitives, structures, types, modules, resources, routines), and WIP diagrams are kept in `spec-wip/`. This content is not part of the publishable package and is tracked as future work in the roadmap parking lot.

## Architecture

The language is built on a self-describing bootstrap model where the meta-model and its instances co-define each other.

Neither the meta-model nor its instances exist independently; together they form the bootstrap layer. This circular dependency is intentional and necessary for a self-describing system.
